import { renderHook } from '@testing-library/react-hooks';
import { UserdocksProvider, useUserdocks } from '../src';
import options from './__fixtures__/options';

const getTokenMock = jest.fn().mockReturnValue({
  expiresIn: 0,
});

jest.mock('@userdocks/web-client-sdk', () => async () => ({
  getToken: getTokenMock,
  silentRefresh: jest.fn(),
  redirectTo: jest.fn(),
}));

describe('useUserdocks with zero expiration time on token', () => {
  test('should return isAuthenticated to be false, loading to be false and userdocks to be truthy', async () => {
    const { result, waitForNextUpdate } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should be authenticated with valid expired', async () => {
    getTokenMock.mockReturnValue({
      expiresIn: 100,
    });

    const { result, waitForNextUpdate } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should allow manual refresh', async () => {
    getTokenMock.mockReturnValue({
      expiresIn: 100,
    });

    const { result, waitForNextUpdate } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();
  });
});
