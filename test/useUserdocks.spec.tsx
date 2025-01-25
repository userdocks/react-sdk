import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import userdocks from '@userdocks/web-client-sdk';
import { UserdocksProvider, useUserdocks } from '../src';
import options from './__fixtures__/options';

describe('useUserdocks', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should initially return isAuthenticated to be false, loading to be false and userdocks to be truthy', async () => {
    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should be authenticated, when calling getToken which resolves to a token with a valid expiresIn', async () => {
    vi.spyOn(userdocks, 'getToken').mockReturnValue(
      Promise.resolve({
        expiresIn: 100,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
        refreshToken: null,
      })
    );

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await act(async () => {
      const token = result.current.userdocks.getToken();

      vi.runAllTimers();

      await token;
    });

    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should not be authenticated, when calling getToken which resolves to a token with an invalid expiresIn', async () => {
    vi.spyOn(userdocks, 'getToken').mockReturnValue(
      Promise.resolve({
        expiresIn: 0,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
        refreshToken: null,
      })
    );

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await act(async () => {
      const token = result.current.userdocks.getToken();

      vi.runAllTimers();

      await token;
    });

    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should wait until isInitialized has been called', async () => {
    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    // when getToken has been called
    const token = result.current.userdocks.getToken();

    // then it is still not authenticated
    expect(result.current.isAuthenticated).toBe(null);

    // when the times have been run
    await act(async () => {
      vi.runAllTimers();

      await token;
    });

    // then isAuthenticated has been called to false
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should wait a minimum of 1 second', async () => {
    // given real timers
    vi.useRealTimers();

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    const start = performance.now();

    // when
    await act(async () => {
      await result.current.userdocks.getToken();
    });

    const end = performance.now();

    // then it should at least take one second
    expect(end - start).toBeGreaterThanOrEqual(1000);
  });

  test('should be rather quickly initialized', async () => {
    // given real timers
    vi.useRealTimers();

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    const start = performance.now();

    // when
    await act(async () => {
      await result.current.userdocks.initialize();
      await result.current.userdocks.getToken();
    });

    const end = performance.now();

    // then it should at least take one second
    expect(end - start).toBeLessThanOrEqual(200);
  });
});
