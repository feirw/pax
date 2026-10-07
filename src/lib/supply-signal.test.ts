import { describe, expect, it } from 'vitest';
import { BRIEFING_DURATION, briefing, risks, getMockAnswer } from './supply-signal';

describe('Supply Signal mock briefing', () => {
  it('runs for exactly 60 seconds', () => { expect(BRIEFING_DURATION).toBe(60); expect(briefing.at(-1)?.at).toBeLessThan(60); });
  it('provides three suppliers with seven daily risk readings', () => { expect(risks).toHaveLength(3); risks.forEach(risk => { expect(risk.history).toHaveLength(7); expect(risk.history.at(-1)).toBe(risk.score); expect(risk.score).toBeGreaterThanOrEqual(0); expect(risk.score).toBeLessThanOrEqual(100); }); });
  it('returns the selected supplier change', () => { expect(getMockAnswer('What changed for ASML?')).toContain('fell 3 points to 32/100'); });
});