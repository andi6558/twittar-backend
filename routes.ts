import {Router} from "https://deno.land/x/oak/mod.ts";
import { signup, login, authorize } from "./controllers/user.ts";
import { getTweets, postTweet } from "./controllers/tweet.ts";
const router = new Router();


router
    .post("/api/signup", signup)
    .post("/api/login", login);

router
    .get("/api/tweets", /*authorize, */getTweets)
    .post("/api/tweets", authorize, postTweet);

export default router;