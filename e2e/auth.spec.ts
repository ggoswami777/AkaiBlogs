import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("signup → login → logout cycle", async ({ page }) => {
    // Signup
    await page.goto("/auth/signup");
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    // OTP would be intercepted via MSW or test backend
    await page.click('button[type="submit"]');
    
    // Login
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*feed|chat|home/);
  });
});