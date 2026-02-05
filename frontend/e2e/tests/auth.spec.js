import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register a new user successfully', async ({ page }) => {
    // Navigate to register page
    await page.click('text=Register');
    await expect(page).toHaveURL(/.*register/);

    // Fill registration form
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'testuser@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');

    // Submit form
    await page.click('[data-testid="register-button"]');

    // Should redirect to dashboard or show success message
    await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 10000 });
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Login');

    // Fill with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');

    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should allow password reset', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Login');

    // Click forgot password
    await page.click('text=Forgot Password?');

    // Fill email for password reset
    await page.fill('[data-testid="reset-email-input"]', 'test@example.com');
    await page.click('[data-testid="reset-button"]');

    // Should show success message
    await expect(page.locator('text=Password reset email sent')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Should redirect to home and show logout message
    await expect(page).toHaveURL(/.*/);
    await expect(page.locator('text=Logout successful')).toBeVisible();
  });
});