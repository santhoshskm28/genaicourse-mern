import { test, expect } from '@playwright/test';

test.describe('Load Testing - Concurrent Users', () => {
  test('LOAD-001: Simulate multiple concurrent users', async ({ browser }) => {
    const userCount = 10;
    const userPromises = [];
    
    // Simulate multiple users accessing the platform simultaneously
    for (let i = 0; i < userCount; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const userPromise = (async (userId) => {
        try {
          // User registers
          await page.goto('/register');
          await page.fill('[data-testid="name-input"]', `User ${userId}`);
          await page.fill('[data-testid="email-input"]`, `user${userId}@example.com`);
          await page.fill('[data-testid="password-input"]', 'password123');
          await page.fill('[data-testid="confirm-password-input"]', 'password123');
          await page.click('[data-testid="register-button"]');
          
          // User browses courses
          await page.click('text=Courses');
          await page.waitForSelector('.course-card');
          
          // User enrolls in a course
          await page.click('.course-card:first-child');
          await page.click('[data-testid="enroll-button"]');
          
          return { userId, success: true };
        } catch (error) {
          return { userId, success: false, error: error.message };
        } finally {
          await context.close();
        }
      })(i);
      
      userPromises.push(userPromise);
    }
    
    // Wait for all users to complete
    const results = await Promise.all(userPromises);
    
    // Analyze results
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`Successful users: ${successCount}/${userCount}`);
    console.log(`Failed users: ${failureCount}/${userCount}`);
    
    // At least 80% of users should succeed
    expect(successCount).toBeGreaterThanOrEqual(userCount * 0.8);
  });

  test('LOAD-002: Stress test search functionality', async ({ browser }) => {
    const searchQueries = [
      'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
      'Machine Learning', 'Data Science', 'Web Development', 'Mobile Development'
    ];
    
    const searchPromises = searchQueries.map(async (query, index) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      try {
        await page.goto('/courses');
        
        const startTime = Date.now();
        await page.fill('[data-testid="course-search"]', query);
        await page.waitForSelector('.course-card');
        const responseTime = Date.now() - startTime;
        
        return { query, responseTime, success: true };
      } catch (error) {
        return { query, success: false, error: error.message };
      } finally {
        await context.close();
      }
    });
    
    const results = await Promise.all(searchPromises);
    
    // Analyze search performance
    const successfulSearches = results.filter(r => r.success);
    const averageResponseTime = successfulSearches.reduce((sum, r) => sum + r.responseTime, 0) / successfulSearches.length;
    
    console.log(`Average search response time: ${averageResponseTime}ms`);
    
    expect(averageResponseTime).toBeLessThan(1500);
    expect(successfulSearches.length).toBeGreaterThan(searchQueries.length * 0.8);
  });

  test('LOAD-003: Video streaming performance under load', async ({ browser }) => {
    const videoUsers = 5;
    const videoPromises = [];
    
    for (let i = 0; i < videoUsers; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const videoPromise = (async (userId) => {
        try {
          // Login and navigate to course
          await page.goto('/login');
          await page.fill('[data-testid="email-input"]', `user${userId}@example.com`);
          await page.fill('[data-testid="password-input"]', 'password123');
          await page.click('[data-testid="login-button"]');
          
          await page.goto('/courses');
          await page.click('.course-card:first-child');
          await page.click('[data-testid="enroll-button"]');
          await page.click('[data-testid="start-learning-button"]');
          
          // Start video playback
          await page.click('[data-testid="play-button"]');
          
          // Monitor video performance
          const videoMetrics = await page.evaluate(async () => {
            const video = document.querySelector('video');
            if (!video) return { buffered: 0, played: 0 };
            
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  buffered: video.buffered.length,
                  played: video.played.length,
                  currentTime: video.currentTime,
                  duration: video.duration
                });
              }, 3000);
            });
          });
          
          return { userId, success: true, metrics: videoMetrics };
        } catch (error) {
          return { userId, success: false, error: error.message };
        } finally {
          await context.close();
        }
      })(i);
      
      videoPromises.push(videoPromise);
    }
    
    const results = await Promise.all(videoPromises);
    
    // Analyze video performance
    const successfulVideoStreams = results.filter(r => r.success);
    console.log(`Successful video streams: ${successfulVideoStreams.length}/${videoUsers}`);
    
    // Most users should be able to stream video
    expect(successfulVideoStreams.length).toBeGreaterThanOrEqual(videoUsers * 0.8);
  });
});