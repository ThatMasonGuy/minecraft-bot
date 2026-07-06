import { config as loadDotenv } from "dotenv";
import { z } from "zod";

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return value;

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;

  return value;
}, z.boolean());

const optionalSecret = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();

const envSchema = z.object({
  MINECRAFT_HOST: z.string().trim().min(1).default("localhost"),
  MINECRAFT_PORT: z.coerce.number().int().min(1).max(65535).default(25565),
  MINECRAFT_USERNAME: z.string().trim().min(1).default("AIPlayer"),
  MINECRAFT_AUTH: z.enum(["offline", "microsoft"]).default("offline"),
  MINECRAFT_VERSION: z.string().trim().min(1).default("1.21.11"),
  OPENAI_API_KEY: optionalSecret,
  OPENAI_MODEL: optionalSecret,
  DATABASE_URL: z.string().trim().min(1).default("file:./runtime/memory.sqlite"),
  MEMORY_DIR: z.string().trim().min(1).default("./runtime/memory"),
  VIEWER_PORT: z.coerce.number().int().min(1).max(65535).default(3007),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  ENABLE_WEB_RESEARCH: booleanFromEnv.default(true),
  ALLOW_INSECURE_CODE_EXECUTION: booleanFromEnv.default(false),
  PUBLIC_REPO_MODE: booleanFromEnv.default(true),
});

export type AppEnv = z.infer<typeof envSchema>;

export type LoadEnvOptions = {
  envFilePath?: string;
  values?: NodeJS.ProcessEnv;
};

export function loadEnv(options: LoadEnvOptions = {}): AppEnv {
  if (!options.values) {
    loadDotenv({ path: options.envFilePath ?? ".env", quiet: true });
  }

  const source = options.values ?? process.env;
  return envSchema.parse(source);
}

export function summarizeEnv(env: AppEnv) {
  return {
    minecraftHost: env.MINECRAFT_HOST,
    minecraftPort: env.MINECRAFT_PORT,
    minecraftUsername: env.MINECRAFT_USERNAME,
    minecraftAuth: env.MINECRAFT_AUTH,
    minecraftVersion: env.MINECRAFT_VERSION,
    hasOpenAiKey: Boolean(env.OPENAI_API_KEY),
    openAiModel: env.OPENAI_MODEL ?? null,
    databaseUrl: env.DATABASE_URL,
    memoryDir: env.MEMORY_DIR,
    viewerPort: env.VIEWER_PORT,
    logLevel: env.LOG_LEVEL,
    enableWebResearch: env.ENABLE_WEB_RESEARCH,
    allowInsecureCodeExecution: env.ALLOW_INSECURE_CODE_EXECUTION,
    publicRepoMode: env.PUBLIC_REPO_MODE,
  };
}
