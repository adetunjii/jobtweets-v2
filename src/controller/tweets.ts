import { Request, Response } from "express";
import { isEmpty } from "lodash";
import { Tweet } from "Tweet";
import { RedisClient } from "../lib/redis";

const redis = RedisClient();
const listKey = "tweets";

const getTweets = async (start: number, stop: number) => {
  const tweets: unknown[] = [];
  const tweetKeys = await redis.lrange(listKey, start, stop);

  if (tweetKeys.length >= 1) {
    for (let i = 0; i < tweetKeys.length; i++) {
      const key = tweetKeys[i];
      const tweet = await redis.hgetall(key);

      if (isEmpty(tweet) == false) {
        tweets.push(tweet);
      }
    }

    return tweets;
  }
  return tweets;
};

const getRange = (page: number) => {
  let from;
  if (page === 0) {
    from = page * 10;
  } else {
    from = page * 10 + 1;
  }

  const to = (page + 1) * 10;
  return [from, to];
};

export const addTweet = async (tweet: Tweet) => {
  let tweetId;

  try {
    tweetId = await redis.incr("tweet_id");
  } catch (error) {
    console.error("Error incrementing tweets in redis");
  }

  const hashKey = `Tweet:${tweetId}`;
  redis.multi().hset(hashKey, tweet).rpush(listKey, hashKey).exec();
  return;
};

export const getTweetsByRange = async (req: Request, res: Response) => {
  let page = parseInt(req.query.page.toString());

  const [from, to] = getRange(page);

  try {
    const tweets = await getTweets(from, to);
    if (tweets) {
      res.status(200).send(tweets);
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(
      `An error occured from getting tweets in range (${from} - ${to})`
    );
    console.error(error);
    res.status(400).send();
  }
};
