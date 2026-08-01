import { describe, it, expect } from "vitest";
import {
  loginSchema,
  sendOtpSchema,
  signupSchema,
} from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts valid email + password", () => {
    expect(
      loginSchema.parse({ email: "a@b.com", password: "pass" }),
    ).toBeTruthy();
  });

  it("rejects invalid email", () => {
    expect(() =>
      loginSchema.parse({ email: "bad", password: "pass" }),
    ).toThrow();
  });

  it("rejects empty password", () => {
    expect(() =>
      loginSchema.parse({ email: "a@b.com", password: "" }),
    ).toThrow();
  });
});

describe("sendOtpSchema", () => {
  it("accepts valid signup fields", () => {
    expect(
      sendOtpSchema.parse({
        username: "testuser",
        email: "a@b.com",
        password: "12345678",
      }),
    ).toBeTruthy();
  });
  it("rejects short username", () => {
    expect(() =>
      sendOtpSchema.parse({
        username: "ab",
        email: "a@b.com",
        password: "12345678",
      }),
    ).toThrow();
  });

  it("rejects short password", () => {
    expect(() =>
      sendOtpSchema.parse({
        username: "testuser",
        email: "a@b.com",
        password: "123",
      }),
    ).toThrow();
  });
});

describe("signupSchema", () => {
  it("accepts valid 6-digit OTP", () => {
    expect(
      signupSchema.parse({
        username: "testuser",
        email: "a@b.com",
        password: "12345678",
        otp: "123456",
      }),
    ).toBeTruthy();
  });

  it("rejects non-numeric OTP", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "a@b.com",
        password: "12345678",
        otp: "abcdef",
      }),
    ).toThrow();
  });

  it("rejects non-numeric OTP", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "a@b.com",
        password: "12345678",
        otp: "abcdef",
      }),
    ).toThrow();
  });
});
