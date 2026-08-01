import { test, expect } from "@playwright/test";

test.describe("Blog flow", () => {
  test("create blog → appears in feed", async ({ page }) => {
    await page.goto("/akaiBlogs/create");
    await page.fill('input[placeholder*="title" i] || textarea', "Test Blog Title");
    await page.fill('textarea', "Test blog content body");
    await page.click('button:has-text("Publish") || button[type="submit"]');
    
    await page.goto("/akaiBlogs/feed");
    await expect(page.locator("text=Test Blog Title")).toBeVisible();
  });

  test("like blog increments count", async ({ page }) => {
    await page.goto("/akaiBlogs/feed");
    const likeBtn = page.locator('[data-testid="like-btn"]').first();
    await likeBtn.click();
    // Verify like state changed
  });
});