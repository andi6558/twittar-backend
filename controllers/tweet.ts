import db from "./db.ts";
import { tweetSchema } from "./utils.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

const Tweets = db.collection<tweetSchema>("tweets");

export const getTweets = async ({ response }: { response: any }) => {
  // get all tweets in the database
  const tweets = await Tweets.find().toArray();
  response.body = {
    success: true,
    tweets,
  };
};

export const postTweet = async (
  ctx: Context
) => {
  const { request, response } = ctx;
  const { text } = await request.body().value;
  // Read username from context
  const username = ctx.state.user.username;
  const tweet = await Tweets.insertOne({
    user : username,
    text,
    createdAt: new Date(),
  });
  response.body = {
    success: true,
    message: "Tweet created successfully",
    username,
    text,
  };
};
