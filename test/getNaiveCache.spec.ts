import getNaiveCache from '../src/getNaiveCache';

describe('getNaiveCache', () => {
  afterEach(() => {
    const publicKeyCache = getNaiveCache('publicKey');
    publicKeyCache.clear();
  });
  test('should return the default value (when default value provided) if not set and return the set value when changed', async () => {
    const publicKeyCache = getNaiveCache('publicKey', 'test');
    const expectedResultWithoptionsValue = 'test';
    const expectedResultWithNewSetValue = 'test-after-2-get';
    const result1WithoptionsValue = publicKeyCache.get();
    const result2WithoptionsValue = publicKeyCache.get();
    publicKeyCache.set('test-after-2-get');
    const result3WithNewSetValue = publicKeyCache.get();

    expect(result1WithoptionsValue).toBe(expectedResultWithoptionsValue);
    expect(result2WithoptionsValue).toBe(expectedResultWithoptionsValue);
    expect(result3WithNewSetValue).toBe(expectedResultWithNewSetValue);
  });
  test('should return undefined if not set and return the set value when changed', async () => {
    const publicKeyCache = getNaiveCache('publicKey');
    const expectedResultWithoptionsValue = undefined;
    const expectedResultWithNewSetValue = 'test-after-2-get';
    const result1WithoptionsValue = publicKeyCache.get();
    const result2WithoptionsValue = publicKeyCache.get();
    publicKeyCache.set('test-after-2-get');
    const result3WithNewSetValue = publicKeyCache.get();

    expect(result1WithoptionsValue).toBe(expectedResultWithoptionsValue);
    expect(result2WithoptionsValue).toBe(expectedResultWithoptionsValue);
    expect(result3WithNewSetValue).toBe(expectedResultWithNewSetValue);
  });
});
