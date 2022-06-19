export interface RedisConfig {
  cluster: boolean;
  host: string;
  port: number;
  password?: string;
}

export interface QueueConfig {
  prefix: string;
  name: string;
}

export interface Config {
  redisConfig: RedisConfig;
  queues: QueueConfig[];
}
