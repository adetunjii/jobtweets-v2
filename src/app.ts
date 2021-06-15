import express, { Application, Request, Response } from "express";
import { config } from "dotenv";
import util from "util";
import cors from "cors";
import needle from "needle";
import { classifyWithBayes } from "./lib/classifier";
import { addTweet, getTweetsByRange } from "./controller/tweets";
import { scheduler } from "./lib/scheduler";

config();
const classifyTweet = util.promisify(classifyWithBayes);
const streamURL = "https://api.twitter.com/2/tweets/search/stream";
const token = process.env.BEARER_TOKEN;

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/api/v2/tweets", (req: Request, res: Response) => {
  getTweetsByRange(req, res);
});

const stream = needle.get(streamURL, {
  headers: {
    "User-Agent": "v2FilterStreamJS",
    Authorization: `Bearer ${token}`,
  },
  timeout: 20000,
});

stream
  .on("data", async (data) => {
    try {
      if (data.byteLength > 3) {
        var json = JSON.parse(data);

        const classifications: any = await classifyTweet(json?.data.text);
        const tweet: any = {};

        tweet.id = json.data.id;
        tweet.firstClass = classifications[0];
        tweet.secondClass = classifications[1];

        await addTweet(tweet);
      }
    } catch (error) {
      console.error("an error occured: ", error);
    }
  })
  .on("error", (error) => {
    console.error(error);
    process.exit(1);
  });

scheduler.start();
export default app;
