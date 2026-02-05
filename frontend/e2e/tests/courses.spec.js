import { test, expect } from '@playwright/test';

test.describe('Course Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should view course catalog', async ({ page }) => {
    // Navigate to courses
    await page.click('text=Courses');
    await expect(page).toHaveURL(/.*courses/);

    // Should display course cards
    await expect(page.locator('.course-card')).toHaveCount.greaterThan(0);

    // Should have search and filter functionality
    await expect(page.locator('[data-testid="course-search"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();
  });

  test('should search for courses', async ({ page }) => {
    await page.goto('/courses');
    
    // Search for a specific course
    await page.fill('[data-testid="course-search"]', 'JavaScript');
    await page.press('[data-testid="course-search"]', 'Enter');

    // Should show filtered results
    await expect(page.locator('.course-card')).toHaveCount.greaterThan(0);
  });

  test('should filter courses by category', async ({ page }) => {
    await page.goto('/courses');
    
    // Select category filter
    await page.click('[data-testid="filter-dropdown"]');
    await page.click('text=Programming');

    // Should show filtered courses
    await expect(page.locator('.course-card')).toHaveCount.greaterThan(0);
  });

  test('should view course details', async ({ page }) => {
    await page.goto('/courses');
    
    // Click on first course
    await page.click('.course-card:first-child [data-testid="course-link"]');
    
    // Should navigate to course detail page
    await expect(page.locator('[data-testid="course-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-curriculum"]')).toBeVisible();
  });

  test('should enroll in a course', async ({ page }) => {
    await page.goto('/courses');
    
    // Click on first course
    await page.click('.course-card:first-child [data-testid="course-link"]');
    
    // Click enroll button
    await page.click('[data-testid="enroll-button"]');
    
    // Should show success message and update button state
    await expect(page.locator('text=Enrolled successfully')).toBeVisible();
    await expect(page.locator('[data-testid="start-learning-button"]')).toBeVisible();
  });

  test('should access enrolled course content', async ({ page }) => {
    // Go to an enrolled course
    await page.goto('/dashboard');
    await page.click('[data-testid="my-courses"]');
    await page.click('.enrolled-course:first-child');
    
    // Should show course content
    await expect(page.locator('[data-testid="video-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="lesson-list"]')).toBeVisible();
  });

  test('should mark lesson as complete', async ({ page }) => {
    // Navigate to enrolled course
    await page.goto('/dashboard');
    await page.click('[data-testid="my-courses"]');
    await page.click('.enrolled-course:first-child');
    
    // Complete first lesson
    await page.click('[data-testid="complete-lesson-button"]');
    
    // Should update progress
    await expect(page.locator('text=Lesson completed')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toHaveAttribute('value', /\d+/);
  });

  test('should download certificate for completed course', async ({ page }) => {
    // Navigate to a completed course
    await page.goto('/my-certificates');
    
    // Click download certificate
    await page.click('[data-testid="download-certificate-button"]');
    
    // Should trigger download (check for download event)
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('certificate');
  });
});