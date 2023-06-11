import { MongoClient } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

const client = new MongoClient();
const URI = "mongodb://localhost:27017";

try {
    await client.connect(URI);
    console.log("Connected to MongoDB");
} catch (err) {
    console.log(err);
}

const db = client.database("twittar");

export default db;