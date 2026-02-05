// Global test setup
import { jest } from '@jest/globals';

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up global timeout for async operations
jest.setTimeout(10000);