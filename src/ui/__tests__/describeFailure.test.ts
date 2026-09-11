import { describeFailure } from '../describeFailure';
import { defaultStrings } from '../strings';
import { SupportApiError, SupportNetworkError } from '../../core/errors';

describe('describeFailure', () => {
  it('never shows a server message to the end user', () => {
    const leaky = new SupportApiError(
      429,
      'quota_exceeded',
      'The monthly conversation quota is used up.',
    );
    const { text } = describeFailure(leaky, defaultStrings);
    expect(text).toBe(defaultStrings.errorUnavailable);
    expect(text).not.toContain('quota');
  });

  it('does not offer retry when retrying cannot succeed', () => {
    const exhausted = new SupportApiError(429, 'quota_exceeded', 'anything');
    expect(describeFailure(exhausted, defaultStrings).canRetry).toBe(false);
  });

  it('offers retry for rate limits and network failures', () => {
    const limited = new SupportApiError(429, 'rate_limited', 'slow down');
    expect(describeFailure(limited, defaultStrings).canRetry).toBe(true);
    expect(describeFailure(new SupportNetworkError('offline'), defaultStrings)).toEqual({
      text: defaultStrings.errorGeneric,
      canRetry: true,
    });
  });
});
