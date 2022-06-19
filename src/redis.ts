import * as IORedis from 'ioredis';
import { RedisConfig } from './config';

export const createRedis = (
  cfg: RedisConfig,
): IORedis.Redis | IORedis.Cluster => {
  if (cfg.cluster) {
    return new IORedis.Cluster(
      [
        {
          host: cfg.host,
          port: cfg.port,
        },
      ],
      {
        redisOptions: {
          password: cfg.password,
          maxRetriesPerRequest: null,
        },
        enableOfflineQueue: true,
      },
    );
  }

  return new IORedis.default({
    host: cfg.host,
    port: cfg.port,
    password: cfg.password,
    enableOfflineQueue: true,
    maxRetriesPerRequest: null,
  });
};
