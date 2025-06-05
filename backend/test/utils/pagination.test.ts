import { getOffset, getTotalPages } from '../../src/cpe_event_api/utils/pagination';

describe('getOffset', () => {
  it('returns 0 for page 1', () => {
    expect(getOffset(1, 10)).toBe(0);
  });

  it('returns correct offset for page > 1', () => {
    expect(getOffset(2, 10)).toBe(10);
    expect(getOffset(5, 25)).toBe(100);
  });

  it('returns 0 for page <= 1', () => {
    expect(getOffset(0, 10)).toBe(0);
    expect(getOffset(-3, 10)).toBe(0);
  });

  it('returns 0 for size <= 0', () => {
    expect(getOffset(2, 0)).toBe(0);
    expect(getOffset(3, -10)).toBe(0);
  });
});

describe('getTotalPages', () => {
  it('calculates correct number of pages', () => {
    expect(getTotalPages(100, 10)).toBe(10);
    expect(getTotalPages(101, 10)).toBe(11);
    expect(getTotalPages(0, 10)).toBe(0);
  });

  it('returns 0 for size <= 0', () => {
    expect(getTotalPages(100, 0)).toBe(0);
    expect(getTotalPages(100, -5)).toBe(0);
  });

  it('returns 0 for totalEntries < 0', () => {
    expect(getTotalPages(-10, 10)).toBe(0);
  });
});
