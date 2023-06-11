import { key, userSchema } from "./utils.ts";
import db from "./db.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.7/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

const Users = db.collection<userSchema>("users");

export const signup = async (
  { request, response }: { request: any; response: any },
) => {
  const { username, password } = await request.body().value;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const _id = await Users.insertOne({
    username,
    password: hashedPassword,
    following: [],
  });

  response.status = 200;
  response.body = {
    success: true,
    message: "User created successfully",
    user: {
      _id: _id,
      username,
    },
  };
};

export const login = async (
  { request, response }: { request: any; response: any },
) => {
  const { username, password } = await request.body().value;
  const user = await Users.findOne({ username });

  if (!user) {
    response.status = 400;
    response.body = {
      success: false,
      message: "User not found",
    };
    return;
  }

  const isValid = bcrypt.compareSync(password, user.password);

  if (!isValid) {
    response.status = 401;
    response.body = {
      success: false,
      message: "Invalid credentials",
    };
    return;
  }

  const payload = {
    username: user.username,
    _id: user._id,
    exp: getNumericDate(60 * 60 * 24),
  };

  const token = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  if (!token) {
    console.log(payload, key);
    response.status = 500;
    response.body = {
      success: false,
      message: "Could not create token",
    };
    return;
  }
  response.status = 200;
  response.body = {
    success: true,
    _id: user._id,
    message: "User logged in successfully",
    token,
  };
};

export const authorize = async (ctx: Context, next: any) => {
  const authorization = ctx.request.headers.get("authorization");
  if (!authorization) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      message: "Unauthorized - No token provided",
    };
    return;
  }
  try {
    const [, token] = authorization.split(" ");
    console.log("Token: ", token);
    const { payload } = await verify(token, key);
    ctx.state.user = payload;
    await next();
  } catch (err) {
    console.log(err);
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      message: "Unauthorized - Invalid token",
    };
  }
};

export const follow = async (ctx: Context, next: any) => {
  const { request, response } = ctx;
  const { username } = await request.body().value;
  const { _id } = ctx.state.user;
  const user = await Users.findOne({ _id });
  if (!user) {
    response.status = 400;
    response.body = {
      success: false,
      message: "User not found",
    };
    return;
  }
  user.following.push(username);
  await Users.updateOne({ _id }, { $set: { following: user.following } });
  response.status = 200;
  response.body = {
    success: true,
    message: "User followed successfully",
  };
}