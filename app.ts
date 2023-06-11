import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/oakCors.ts";

import router from "./routes.ts";

const app = new Application();
const PORT = 2321;

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT });
console.log(`Server is running on port ${PORT}`);