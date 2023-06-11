import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

export interface userSchema {
  _id: ObjectId;
  username: string;
  password: string;
  following: string[];
}

export interface tweetSchema {
  _id: ObjectId;
  user: string;
  text: string;
  // a time stamp
  createdAt: Date;
}

export const key = await crypto.subtle.generateKey(
  {
    name: "HMAC",
    hash: "SHA-512",
  },
  true,
  ["sign", "verify"],
);
