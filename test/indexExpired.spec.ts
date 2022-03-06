import { act, renderHook } from '@testing-library/react-hooks';

import useUserdocks from '../src';
import { options } from './__fixtures__/options';

jest.mock('@userdocks/web-client-sdk', () => async () => ({
  getToken: jest
    .fn()
    .mockReturnValueOnce({
      expiresIn: 0,
    })
    .mockReturnValueOnce({
      expiresIn: 0,
    }),
  silentRefresh: jest.fn(),
  redirectTo: jest.fn(),
}));

describe('useUserdocks with zero expiration time on token', () => {
  test('should return isAuthenticated to be false, loading to be false and userdocks to be truthy', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserdocks(options)
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();
  });
  test('should return isAuthenticated to be false, loading to be false and userdocks to be truthy and cached', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserdocks(options)
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();

    act(() => {
      result.current.clear();
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeFalsy();
  });
});
