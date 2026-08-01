import {
  createConservationSchema,
  sendMessageSchema,
} from "@/lib/validations/chat";
import { describe, expect, it } from "vitest";

describe("createConverationSchema", () => {
  it("accepts valid receiverId", () => {
    expect(
      createConservationSchema.parse({ receiverId: "abc-123" }),
    ).toBeTruthy();
  });

  it("rejects empty receiverId", () => {
    expect(() => createConservationSchema.parse({ receiverId: "" })).toThrow();
  });
});

describe("sendMessageSchema", () => {
  it("accepts text message", () => {
    expect(
      sendMessageSchema.parse({
        conversationId: "c1",
        receiverId: "r1",
        content: "hello",
      }),
    ).toBeTruthy();
  });

  it("accepts shared blog", () => {
    expect(
      sendMessageSchema.parse({
        conversationId: "c1",
        receiverId: "r1",
        sharedBlogId: "b1",
      }),
    ).toBeTruthy();
  });

  it("rejects empty content and no sharedBlog", () => {
    expect(() =>
      sendMessageSchema.parse({
        conversationId: "c1",
        receiverId: "r1",
      }),
    ).toThrow();
  });

  it("rejects content over 2000 chars", () => {
    expect(() =>
      sendMessageSchema.parse({
        conversationId: "c1",
        receiverId: "r1",
        content: "a".repeat(2001),
      }),
    ).toThrow();
  });
});
