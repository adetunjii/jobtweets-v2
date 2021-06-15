import { CronJob } from "cron";
import { RedisClient } from "./redis";

const redis = RedisClient();

export const scheduler = new CronJob("00 00 * * *", async () => {
  await redis.flushall();
});
