export class ConfigurationError extends Error {
  constructor(name: string) {
    super(`Missing server configuration: ${name}`);
    this.name = "ConfigurationError";
  }
}

type RuntimeEnv = Record<string, unknown>;

function getRuntimeEnv(): RuntimeEnv | undefined {
  return (globalThis as typeof globalThis & { __env__?: RuntimeEnv }).__env__;
}

function getNodeEnv(): RuntimeEnv | undefined {
  return (
    globalThis as typeof globalThis & {
      process?: { env?: RuntimeEnv };
    }
  ).process?.env;
}

export function getServerEnv(name: string): string | undefined {
  const runtimeValue = getRuntimeEnv()?.[name];
  if (typeof runtimeValue === "string" && runtimeValue.length > 0) {
    return runtimeValue;
  }

  const nodeValue = getNodeEnv()?.[name];
  return typeof nodeValue === "string" && nodeValue.length > 0 ? nodeValue : undefined;
}

export function requireServerEnv(name: string): string {
  const value = getServerEnv(name);
  if (!value) {
    throw new ConfigurationError(name);
  }
  return value;
}
