import Redis, { RedisOptions } from "ioredis";
import { config } from "dotenv";

config();
export const RedisClient = () => {
  const options: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  };

  return new Redis(options);
};
