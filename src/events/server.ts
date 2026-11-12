import { env } from "../config/env";
import { logger } from "../utils/logger";
import { createApp } from "./app";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Listening to Port http://localhost:${env.PORT}`);
});
