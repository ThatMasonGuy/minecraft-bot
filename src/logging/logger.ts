import pino from "pino";

import type { AppEnv } from "../config/env.js";

export function createLogger(env: Pick<AppEnv, "LOG_LEVEL">) {
  return pino({
    level: env.LOG_LEVEL,
    redact: {
      paths: [
        "OPENAI_API_KEY",
        "openAiApiKey",
        "*.OPENAI_API_KEY",
        "*.openAiApiKey",
        "config.OPENAI_API_KEY",
      ],
      censor: "[redacted]",
    },
  });
}
