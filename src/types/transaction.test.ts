import { describe, it, expect } from 'vitest';
import { getRiskLevel } from './transaction';

describe('getRiskLevel', () => {
  it('returns high for riskScore > 70', () => {
    expect(getRiskLevel(71)).toBe('high');
    expect(getRiskLevel(100)).toBe('high');
  });

  it('returns medium for riskScore 40-70', () => {
    expect(getRiskLevel(40)).toBe('medium');
    expect(getRiskLevel(55)).toBe('medium');
    expect(getRiskLevel(70)).toBe('medium');
  });

  it('returns low for riskScore < 40', () => {
    expect(getRiskLevel(0)).toBe('low');
    expect(getRiskLevel(39)).toBe('low');
  });
});
