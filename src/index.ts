import { loadEnv, summarizeEnv } from "./config/env.js";
import { createLogger } from "./logging/logger.js";

const env = loadEnv();
const logger = createLogger(env);

logger.info(
  {
    config: summarizeEnv(env),
  },
  "Minecraft bot scaffold ready. Phase 1 does not connect to Minecraft yet.",
);
