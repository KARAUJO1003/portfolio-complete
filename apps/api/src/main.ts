import { createApp } from "./app";
import { env } from "./config/env";
import { connectMongo } from "./infra/database/mongo.connection";
import { ensureAdminUser } from "./modules/auth/auth.service";

async function bootstrap() {
  await connectMongo();
  if (env.authEnabled) {
    await ensureAdminUser();
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("[api] failed to start", error);
  process.exit(1);
});
