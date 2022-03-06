import { act, renderHook } from '@testing-library/react-hooks';

import useUserdocks from '../src';
import { options } from './__fixtures__/options';

jest.mock('@userdocks/web-client-sdk', () => async () => ({
  getToken: jest
    .fn()
    .mockReturnValueOnce({
      expiresIn: 1,
    })
    .mockReturnValueOnce({
      expiresIn: 1,
    }),
  silentRefresh: jest.fn(),
  rediretcTo: jest.fn(),
}));

describe('useUserdocks with positive expiration time on token', () => {
  test('should return isAuthenticated to be true, loading to be false and userdocks to be truthy', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserdocks(options)
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();
  });
  test('should return isAuthenticated to be true, loading to be false and userdocks to be truthy and cached', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserdocks(options)
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();

    act(() => {
      result.current.clear();
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeFalsy();
  });
});
