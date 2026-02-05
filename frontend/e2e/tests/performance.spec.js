import { test, expect } from '@playwright/test';

test.describe('Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.route('**/*', (route) => {
      route.continue();
    });
  });

  test('PERF-001: Home page performance metrics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Measure page load time
    const loadTime = Date.now() - startTime;
    console.log(`Home page load time: ${loadTime}ms`);
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Check Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
      };
    });
    
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1800); // 1.8s
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2s
  });

  test('PERF-002: Course catalog page performance with large datasets', async ({ page }) => {
    await page.goto('/courses');
    
    // Measure initial render time
    const renderStart = Date.now();
    await page.waitForSelector('.course-card');
    const renderTime = Date.now() - renderStart;
    
    console.log(`Course catalog render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(2000);
    
    // Test pagination performance
    const paginationStart = Date.now();
    await page.click('[data-testid="next-page"]');
    await page.waitForSelector('.course-card');
    const paginationTime = Date.now() - paginationStart;
    
    console.log(`Pagination load time: ${paginationTime}ms`);
    expect(paginationTime).toBeLessThan(1500);
  });

  test('PERF-003: Search performance under load', async ({ page }) => {
    await page.goto('/courses');
    
    // Measure search response time
    const searchStart = Date.now();
    await page.fill('[data-testid="course-search"]', 'JavaScript');
    await page.waitForSelector('.course-card');
    const searchTime = Date.now() - searchStart;
    
    console.log(`Search response time: ${searchTime}ms`);
    expect(searchTime).toBeLessThan(1000);
    
    // Test with complex search query
    const complexSearchStart = Date.now();
    await page.fill('[data-testid="course-search"]', 'Advanced React with TypeScript and Node.js');
    await page.waitForTimeout(500); // Allow debounce
    const complexSearchTime = Date.now() - complexSearchStart;
    
    console.log(`Complex search time: ${complexSearchTime}ms`);
    expect(complexSearchTime).toBeLessThan(2000);
  });

  test('PERF-004: Video loading and playback performance', async ({ page }) => {
    // Login and navigate to course
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/courses');
    await page.click('.course-card:first-child');
    await page.click('[data-testid="enroll-button"]');
    await page.click('[data-testid="start-learning-button"]');
    
    // Measure video player load time
    const videoLoadStart = Date.now();
    await page.waitForSelector('[data-testid="video-player"]');
    const videoLoadTime = Date.now() - videoLoadStart;
    
    console.log(`Video player load time: ${videoLoadTime}ms`);
    expect(videoLoadTime).toBeLessThan(3000);
    
    // Test video interaction responsiveness
    const interactionStart = Date.now();
    await page.click('[data-testid="play-button"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="pause-button"]');
    const interactionTime = Date.now() - interactionStart;
    
    console.log(`Video interaction time: ${interactionTime}ms`);
    expect(interactionTime).toBeLessThan(1000);
  });

  test('PERF-005: Memory usage test', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    // Simulate user interactions that consume memory
    for (let i = 0; i < 10; i++) {
      await page.click('text=Courses');
      await page.waitForSelector('.course-card');
      await page.click('text=Home');
      await page.waitForSelector('h1');
    }
    
    // Check memory usage after interactions
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    const memoryIncrease = finalMemory - initialMemory;
    console.log(`Memory increase: ${memoryIncrease / 1024 / 1024}MB`);
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('PERF-006: Network request optimization', async ({ page }) => {
    // Monitor network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });
    
    await page.goto('/');
    
    // Check for optimized resources
    const cssRequests = requests.filter(req => req.url.includes('.css'));
    const jsRequests = requests.filter(req => req.url.includes('.js'));
    const imageRequests = requests.filter(req => req.url.match(/\.(jpg|jpeg|png|webp|svg)$/));
    
    console.log(`CSS requests: ${cssRequests.length}`);
    console.log(`JS requests: ${jsRequests.length}`);
    console.log(`Image requests: ${imageRequests.length}`);
    
    // Should have reasonable number of requests
    expect(cssRequests.length).toBeLessThan(10);
    expect(jsRequests.length).toBeLessThan(15);
    
    // Check for compression headers
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });
    
    await page.goto('/courses');
    
    // Most responses should be compressed
    const compressedResponses = responses.filter(resp => 
      resp.headers['content-encoding'] === 'gzip' || 
      resp.headers['content-encoding'] === 'br'
    );
    
    expect(compressedResponses.length).toBeGreaterThan(responses.length * 0.7);
  });

  test('PERF-007: Bundle size optimization', async ({ page }) => {
    // Monitor resource loading
    const resources = [];
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        const buffer = await response.body();
        resources.push({
          url: url,
          size: buffer.length,
          type: url.includes('.js') ? 'js' : 'css'
        });
      }
    });
    
    await page.goto('/');
    
    // Calculate total bundle sizes
    const jsTotalSize = resources.filter(r => r.type === 'js').reduce((sum, r) => sum + r.size, 0);
    const cssTotalSize = resources.filter(r => r.type === 'css').reduce((sum, r) => sum + r.size, 0);
    
    console.log(`Total JS size: ${(jsTotalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total CSS size: ${(cssTotalSize / 1024).toFixed(2)}KB`);
    
    // Bundle sizes should be optimized
    expect(jsTotalSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB
    expect(cssTotalSize).toBeLessThan(200 * 1024); // Less than 200KB
  });
});