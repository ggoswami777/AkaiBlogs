import { vi } from "vitest";


if (!globalThis.crypto?.subtle) {
  const { webcrypto } = await import("node:crypto");
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}