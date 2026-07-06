import { describe, expect, it } from "vitest";

import { loadEnv, summarizeEnv } from "../../src/config/env.js";

describe("loadEnv", () => {
  it("loads safe defaults when optional values are absent", () => {
    const env = loadEnv({ values: {} });

    expect(env.MINECRAFT_HOST).toBe("localhost");
    expect(env.MINECRAFT_PORT).toBe(25565);
    expect(env.MINECRAFT_USERNAME).toBe("AIPlayer");
    expect(env.MINECRAFT_AUTH).toBe("offline");
    expect(env.MINECRAFT_VERSION).toBe("1.21.11");
    expect(env.ENABLE_WEB_RESEARCH).toBe(true);
    expect(env.ALLOW_INSECURE_CODE_EXECUTION).toBe(false);
    expect(env.PUBLIC_REPO_MODE).toBe(true);
  });

  it("coerces configured values into typed env", () => {
    const env = loadEnv({
      values: {
        MINECRAFT_HOST: "mc.local",
        MINECRAFT_PORT: "25566",
        MINECRAFT_USERNAME: "TestBot",
        MINECRAFT_AUTH: "microsoft",
        ENABLE_WEB_RESEARCH: "false",
        ALLOW_INSECURE_CODE_EXECUTION: "0",
        PUBLIC_REPO_MODE: "yes",
      },
    });

    expect(env.MINECRAFT_HOST).toBe("mc.local");
    expect(env.MINECRAFT_PORT).toBe(25566);
    expect(env.MINECRAFT_USERNAME).toBe("TestBot");
    expect(env.MINECRAFT_AUTH).toBe("microsoft");
    expect(env.ENABLE_WEB_RESEARCH).toBe(false);
    expect(env.ALLOW_INSECURE_CODE_EXECUTION).toBe(false);
    expect(env.PUBLIC_REPO_MODE).toBe(true);
  });

  it("summarizes secrets as presence flags", () => {
    const env = loadEnv({
      values: {
        OPENAI_API_KEY: "not-a-real-key",
      },
    });

    expect(summarizeEnv(env)).toMatchObject({
      hasOpenAiKey: true,
    });
    expect(JSON.stringify(summarizeEnv(env))).not.toContain("not-a-real-key");
  });
});
