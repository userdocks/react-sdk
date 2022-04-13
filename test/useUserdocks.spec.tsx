import { renderHook } from '@testing-library/react-hooks';
import userdocks from '@userdocks/web-client-sdk';
import { mocked } from 'ts-jest/utils';
import { UserdocksProvider, useUserdocks } from '../src';
import options from './__fixtures__/options';

jest.mock('@userdocks/web-client-sdk', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    getToken: jest.fn().mockReturnValue({
      expiresIn: 0,
    }),
    silentRefresh: jest.fn(),
    redirectTo: jest.fn(),
  },
}));

const userdocksMock = mocked(userdocks);

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
    userdocksMock.getToken.mockReturnValue(
      Promise.resolve({
        expiresIn: 100,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
      })
    );

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
    userdocksMock.getToken.mockReturnValue(
      Promise.resolve({
        expiresIn: 100,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
      })
    );

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
