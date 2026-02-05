import { describe, it, expect } from 'vitest';

describe('Basic Frontend Tests', () => {
  it('should perform basic math operations', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });

  it('should handle string operations', () => {
    const str = 'Hello World';
    expect(str.toLowerCase()).toBe('hello world');
    expect(str.length).toBe(11);
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.includes(3)).toBe(true);
    expect(arr.length).toBe(5);
  });
});