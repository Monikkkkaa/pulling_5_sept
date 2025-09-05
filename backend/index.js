import "./_config/env.js";
import { connectDB } from "./_config/db.js";
import { createServer } from "./server.js";

async function main() {
  await connectDB();
  const app = await createServer();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
