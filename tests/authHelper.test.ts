import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const JWT_SECRET = "test-secret";

describe("auth helper logic", () => {
  it("signs and verifies a valid token", () => {
    const payload = { userId: "u1", username: "testuser" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    const decoded = jwt.verify(token, JWT_SECRET) as typeof payload;
    expect(decoded.userId).toBe("u1");
    expect(decoded.username).toBe("testuser");
  });

  it("rejects invalid token", () => {
    expect(() => jwt.verify("garbage", JWT_SECRET)).toThrow();
  });
  it("rejects expired token", () => {
    const token = jwt.sign({ userId: "u1" }, JWT_SECRET, { expiresIn: "0s" });
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });

  it("rejects token signed with wrong secret", () => {
    const token = jwt.sign({ userId: "u1" }, "wrong-secret");
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });
});
