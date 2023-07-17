import express from 'express';
import * as fs from 'fs';
import { Config } from './config';
import { createRedis } from './redis';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Server } from 'http';

const app = express();
const port = process.env.PORT || 3000;
const configFilePath = process.env.CONFIG_FILE || './config.json';

const config = JSON.parse(fs.readFileSync(configFilePath).toString()) as Config;

const connection = createRedis(config.redisConfig);

const queues: Queue[] = [];

for (let i = 0; i < config.queues.length; i++) {
  const queueCfg = config.queues[i];
  const queue = new Queue(queueCfg.name, {
    prefix: queueCfg.prefix,
    connection: connection,
  });

  queues.push(queue);
}

const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: queues.map((q) => {
    return new BullMQAdapter(q);
  }),
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

const proxyPath = config.proxyPath || '';
app.get('/', (req, res) => {
  res.redirect(`${proxyPath}/admin/queues`);
});

app.get('/health', (req, res) => {
  res.send('ok');
});

const server = app.listen(port, () => {
  return console.log(`Bull Board is listening at http://localhost:${port}`);
});

const gracefulShutdown = (server: Server) => (signal: string) => {
  console.log('starting shutdown, got signal ' + signal);
  if (!server.listening) process.exit(0);

  server.close((err) => {
    if (err) {
      console.log('error closing server: ' + err);
      return process.exit(1);
    }
    process.exit(0);
  });
};

const shutdownHandler = gracefulShutdown(server);
process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);
