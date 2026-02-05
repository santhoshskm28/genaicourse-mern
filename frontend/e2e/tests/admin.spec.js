import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to admin dashboard
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*admin/);
  });

  test('should view admin dashboard statistics', async ({ page }) => {
    // Should display key metrics
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-courses"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-enrollments"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue"]')).toBeVisible();
  });

  test('should create a new course', async ({ page }) => {
    // Navigate to course creation
    await page.click('text=Create Course');
    await expect(page).toHaveURL(/.*admin\/course\/new/);

    // Fill course details
    await page.fill('[data-testid="course-title"]', 'Test Course Title');
    await page.fill('[data-testid="course-description"]', 'This is a test course description');
    await page.selectOption('[data-testid="course-category"]', 'Programming');
    await page.selectOption('[data-testid="course-level"]', 'Beginner');
    await page.fill('[data-testid="course-price"]', '99');
    await page.fill('[data-testid="course-thumbnail"]', 'https://example.com/image.jpg');

    // Add lessons
    await page.click('[data-testid="add-lesson-button"]');
    await page.fill('[data-testid="lesson-title"]', 'Introduction');
    await page.fill('[data-testid="lesson-video-url"]', 'https://example.com/video.mp4');

    // Submit form
    await page.click('[data-testid="save-course-button"]');

    // Should show success message
    await expect(page.locator('text=Course created successfully')).toBeVisible();
  });

  test('should edit existing course', async ({ page }) => {
    // Navigate to course management
    await page.click('text=Manage Courses');
    
    // Click edit on first course
    await page.click('.course-item:first-child [data-testid="edit-button"]');
    
    // Modify course details
    await page.fill('[data-testid="course-title"]', 'Updated Course Title');
    
    // Save changes
    await page.click('[data-testid="update-course-button"]');
    
    // Should show success message
    await expect(page.locator('text=Course updated successfully')).toBeVisible();
  });

  test('should delete a course', async ({ page }) => {
    // Navigate to course management
    await page.click('text=Manage Courses');
    
    // Click delete on first course
    await page.click('.course-item:first-child [data-testid="delete-button"]');
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Should show success message
    await expect(page.locator('text=Course deleted successfully')).toBeVisible();
  });

  test('should view user management', async ({ page }) => {
    // Navigate to user management
    await page.click('text=Manage Users');
    
    // Should display user list
    await expect(page.locator('.user-item')).toHaveCount.greaterThan(0);
    
    // Should have search functionality
    await expect(page.locator('[data-testid="user-search"]')).toBeVisible();
    
    // Search for user
    await page.fill('[data-testid="user-search"]', 'test@example.com');
    await page.press('[data-testid="user-search"]', 'Enter');
    
    // Should show filtered results
    await expect(page.locator('.user-item')).toHaveCount.greaterThan(0);
  });

  test('should manage user roles', async ({ page }) => {
    await page.click('text=Manage Users');
    
    // Click edit user
    await page.click('.user-item:first-child [data-testid="edit-user-button"]');
    
    // Change role
    await page.selectOption('[data-testid="user-role"]', 'Instructor');
    await page.click('[data-testid="save-user-button"]');
    
    // Should show success message
    await expect(page.locator('text=User updated successfully')).toBeVisible();
  });

  test('should view enrollment analytics', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Analytics');
    
    // Should display enrollment chart
    await expect(page.locator('[data-testid="enrollment-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-popularity"]')).toBeVisible();
  });

  test('should export reports', async ({ page }) => {
    await page.click('text=Analytics');
    
    // Click export button
    await page.click('[data-testid="export-report-button"]');
    
    // Should trigger download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('report');
  });

  test('should upload bulk data', async ({ page }) => {
    // Navigate to bulk upload
    await page.click('text=Bulk Upload');
    
    // Upload CSV file
    const fileInput = page.locator('[data-testid="file-input"]');
    await fileInput.setInputFiles('test-data/courses.csv');
    
    // Click upload
    await page.click('[data-testid="upload-button"]');
    
    // Should show upload progress
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
    await expect(page.locator('text=Upload completed')).toBeVisible({ timeout: 30000 });
  });
});