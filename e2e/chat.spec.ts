import { test, expect } from "@playwright/test";

test.describe("Chat flow", () => {
  test("open conversation → send message → appears in thread", async ({ page }) => {
    await page.goto("/akaiBlogs/chat");
    // Select first conversation
    await page.locator('[data-testid="conversation-item"]').first().click();
    // Type and send
    await page.fill('textarea', "Hello from E2E test");
    await page.click('button:has-text("Send") || button[type="submit"]');
    // Verify message appears
    await expect(page.locator("text=Hello from E2E test")).toBeVisible();
  });
});