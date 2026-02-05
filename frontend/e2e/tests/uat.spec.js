import { test, expect } from '@playwright/test';

test.describe('User Acceptance Testing (UAT) - Real User Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Set up realistic viewport
    await page.setViewportSize({ width: 1366, height: 768 });
  });

  test.describe('New User Journey - Complete Learning Experience', () => {
    test('UAT-001: Complete user journey from registration to course completion', async ({ page }) => {
      // Step 1: User discovers platform and registers
      await page.goto('/');
      
      // User checks available courses before registering
      await page.click('text=Courses');
      await expect(page.locator('.course-card')).toHaveCount.greaterThan(0);
      
      // User decides to register
      await page.click('text=Register');
      await expect(page).toHaveURL(/.*register/);
      
      // User fills registration form
      await page.fill('[data-testid="name-input"]', 'John Doe');
      await page.fill('[data-testid="email-input"]', 'john.doe@example.com');
      await page.fill('[data-testid="password-input"]', 'SecurePass123!');
      await page.fill('[data-testid="confirm-password-input"]', 'SecurePass123!');
      await page.click('[data-testid="register-button"]');
      
      // User is redirected to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('text=Welcome, John')).toBeVisible();
      
      // Step 2: User browses and enrolls in first course
      await page.click('text=Courses');
      await page.click('.course-card:first-child');
      
      // User views course details and enrolls
      await expect(page.locator('[data-testid="course-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="course-description"]')).toBeVisible();
      await page.click('[data-testid="enroll-button"]');
      
      // Step 3: User starts learning
      await page.click('[data-testid="start-learning-button"]');
      await expect(page.locator('[data-testid="video-player"]')).toBeVisible();
      
      // User watches first lesson (simulate watching)
      await page.waitForTimeout(2000);
      await page.click('[data-testid="complete-lesson-button"]');
      await expect(page.locator('text=Lesson completed')).toBeVisible();
      
      // Step 4: User checks progress
      await page.click('[data-testid="dashboard-link"]');
      await expect(page.locator('[data-testid="course-progress"]')).toBeVisible();
      
      // Step 5: User continues with next lesson
      await page.click('.enrolled-course:first-child');
      await page.click('.lesson-item:nth-child(2)');
      await expect(page.locator('[data-testid="video-player"]')).toBeVisible();
    });

    test('UAT-002: User searches for specific course content', async ({ page }) => {
      // Login as existing user
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'student@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      // User searches for specific topic
      await page.click('text=Courses');
      await page.fill('[data-testid="course-search"]', 'React');
      await page.press('[data-testid="course-search"]', 'Enter');
      
      // User filters results by level
      await page.selectOption('[data-testid="level-filter"]', 'Intermediate');
      
      // User reviews search results
      const courseCards = page.locator('.course-card');
      await expect(courseCards).toHaveCount.greaterThan(0);
      
      // User clicks most relevant course
      await courseCards.first().click();
      
      // User checks course curriculum matches search intent
      await expect(page.locator('[data-testid="course-curriculum"]')).toContainText('React');
    });

    test('UAT-003: User with accessibility needs', async ({ page }) => {
      // User with keyboard navigation
      await page.goto('/');
      
      // Navigate using keyboard only
      await page.keyboard.press('Tab'); // Should focus on first interactive element
      await page.keyboard.press('Tab'); // Move to next element
      await page.keyboard.press('Enter'); // Activate focused element
      
      // Screen reader user should have proper ARIA labels
      const buttons = page.locator('button, a, input');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = buttons.nth(i);
        await expect(element).toHaveAttribute('aria-label', /\w+/);
      }
      
      // High contrast mode support
      await page.emulateMedia({ colorScheme: 'dark' });
      await expect(page.locator('body')).toHaveClass(/dark/);
    });

    test('UAT-004: Mobile user experience', async ({ page }) => {
      // Simulate mobile device
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Mobile navigation should work
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
      
      // Mobile course cards should be responsive
      await page.click('text=Courses');
      const courseCards = page.locator('.course-card');
      await expect(courseCards).toHaveCount.greaterThan(0);
      
      // Mobile touch interactions
      await courseCards.first().tap();
      await expect(page.locator('[data-testid="course-title"]')).toBeVisible();
    });
  });

  test.describe('Power User Scenarios', () => {
    test('UAT-005: Admin manages entire platform', async ({ page }) => {
      // Admin login
      await page.goto('/admin/login');
      await page.fill('[data-testid="email-input"]', 'admin@genaicourse.com');
      await page.fill('[data-testid="password-input"]', 'adminPass123!');
      await page.click('[data-testid="login-button"]');
      
      // Admin reviews platform metrics
      await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-growth-chart"]')).toBeVisible();
      
      // Admin creates new course with multiple lessons
      await page.click('text=Create Course');
      await page.fill('[data-testid="course-title"]', 'Advanced Node.js Development');
      await page.fill('[data-testid="course-description"]', 'Master Node.js with advanced patterns and best practices');
      await page.selectOption('[data-testid="course-category"]', 'Backend Development');
      await page.selectOption('[data-testid="course-level"]', 'Advanced');
      await page.fill('[data-testid="course-price"]', '149');
      
      // Add multiple lessons
      for (let i = 1; i <= 5; i++) {
        await page.click('[data-testid="add-lesson-button"]');
        await page.fill(`[data-testid="lesson-title-${i}"]`, `Lesson ${i}: Node.js Concepts`);
        await page.fill(`[data-testid="lesson-duration-${i}"]`, '45');
        await page.fill(`[data-testid="lesson-video-url-${i}"]`, `https://example.com/lesson${i}.mp4`);
      }
      
      await page.click('[data-testid="publish-course-button"]');
      await expect(page.locator('text=Course published successfully')).toBeVisible();
      
      // Admin reviews user enrollments
      await page.click('text=Analytics');
      await expect(page.locator('[data-testid="enrollment-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    });

    test('UAT-006: Instructor manages course content', async ({ page }) => {
      // Instructor login
      await page.goto('/instructor/login');
      await page.fill('[data-testid="email-input"]', 'instructor@example.com');
      await page.fill('[data-testid="password-input"]', 'instructorPass123!');
      await page.click('[data-testid="login-button"]');
      
      // Instructor views their courses
      await expect(page.locator('[data-testid="instructor-dashboard"]')).toBeVisible();
      await expect(page.locator('.instructor-course')).toHaveCount.greaterThan(0);
      
      // Instructor updates course content
      await page.click('.instructor-course:first-child [data-testid="edit-course"]');
      await page.fill('[data-testid="course-title"]', 'Updated Course Title');
      await page.click('[data-testid="save-changes-button"]');
      
      // Instructor views student progress
      await page.click('[data-testid="student-progress-tab"]');
      await expect(page.locator('[data-testid="progress-list"]')).toBeVisible();
      
      // Instructor responds to student questions
      await page.click('[data-testid="questions-tab"]');
      await page.fill('[data-testid="question-response"]', 'Great question! Here\'s the explanation...');
      await page.click('[data-testid="submit-response"]');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('UAT-007: Network connectivity issues', async ({ page }) => {
      // Simulate offline scenario
      await page.context().setOffline(true);
      
      await page.goto('/');
      
      // Should show offline message
      await expect(page.locator('[data-testid="offline-notice"]')).toBeVisible();
      
      // User tries to login offline
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      // Should show network error
      await expect(page.locator('text=Network error')).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
      await page.reload();
      await expect(page.locator('[data-testid="offline-notice"]')).not.toBeVisible();
    });

    test('UAT-008: Session timeout handling', async ({ page }) => {
      // User logs in
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      // Navigate to protected area
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Simulate session timeout (clear cookies/localStorage)
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      // Try to access protected content
      await page.reload();
      
      // Should redirect to login with session timeout message
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('text=Session expired')).toBeVisible();
    });

    test('UAT-009: Concurrent user interactions', async ({ page, context }) => {
      // Open multiple tabs to simulate concurrent usage
      const page1 = await context.newPage();
      const page2 = await context.newPage();
      
      // User 1 logs in and enrolls in course
      await page1.goto('/login');
      await page1.fill('[data-testid="email-input"]', 'user1@example.com');
      await page1.fill('[data-testid="password-input"]', 'password123');
      await page1.click('[data-testid="login-button"]');
      await page1.goto('/courses');
      await page1.click('.course-card:first-child');
      await page1.click('[data-testid="enroll-button"]');
      
      // User 2 tries to enroll in same course
      await page2.goto('/login');
      await page2.fill('[data-testid="email-input"]', 'user2@example.com');
      await page2.fill('[data-testid="password-input"]', 'password123');
      await page2.click('[data-testid="login-button"]');
      await page2.goto('/courses');
      await page2.click('.course-card:first-child');
      await page2.click('[data-testid="enroll-button"]');
      
      // Both users should be able to enroll
      await expect(page1.locator('text=Enrolled successfully')).toBeVisible();
      await expect(page2.locator('text=Enrolled successfully')).toBeVisible();
      
      await page1.close();
      await page2.close();
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('UAT-010: Large dataset handling', async ({ page }) => {
      // User browses course catalog with many courses
      await page.goto('/courses');
      
      // Should handle pagination gracefully
      await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
      
      // User navigates through multiple pages
      await page.click('[data-testid="next-page"]');
      await page.click('[data-testid="next-page"]');
      await page.click('[data-testid="previous-page"]');
      
      // Search should work quickly even with large dataset
      await page.fill('[data-testid="course-search"]', 'JavaScript');
      await page.waitForTimeout(1000); // Allow for search to complete
      await expect(page.locator('.course-card')).toHaveCount.greaterThan(0);
    });

    test('UAT-011: Media loading performance', async ({ page }) => {
      await page.goto('/courses');
      await page.click('.course-card:first-child');
      
      // Course thumbnail should load quickly
      const thumbnail = page.locator('[data-testid="course-thumbnail"]');
      await expect(thumbnail).toBeVisible();
      
      // Video player should load without excessive delay
      await page.click('[data-testid="enroll-button"]');
      await page.click('[data-testid="start-learning-button"]');
      
      const videoPlayer = page.locator('[data-testid="video-player"]');
      await expect(videoPlayer).toBeVisible({ timeout: 5000 });
      
      // Check that video controls are responsive
      await page.click('[data-testid="play-button"]');
      await page.waitForTimeout(1000);
      await page.click('[data-testid="pause-button"]');
    });
  });
});