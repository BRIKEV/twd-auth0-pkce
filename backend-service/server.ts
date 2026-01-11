import app from "./app";
import { env } from "./env";

app.listen(env.port, () => {
  console.log(`BFF running on http://localhost:${env.port}`);
});
