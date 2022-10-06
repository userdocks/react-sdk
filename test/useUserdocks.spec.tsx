import { act, renderHook } from '@testing-library/react-hooks';
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

describe('useUserdocks', () => {
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
    userdocksMock.getToken.mockReturnValue(
      Promise.resolve({
        expiresIn: 100,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
      })
    );

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await act(async () => {
      await result.current.userdocks.getToken();
    });

    expect(result.current.isAuthenticated).toBeTruthy();
    expect(result.current.userdocks).toBeTruthy();
  });

  test('should not be authenticated, when calling getToken which resolves to a token with an invalid expiresIn', async () => {
    userdocksMock.getToken.mockReturnValue(
      Promise.resolve({
        expiresIn: 0,
        accessToken: null,
        idToken: null,
        redirectUri: null,
        tokenType: null,
      })
    );

    const { result } = renderHook(useUserdocks, {
      wrapper: ({ children }) => (
        <UserdocksProvider options={options}>{children}</UserdocksProvider>
      ),
    });

    await act(async () => {
      await result.current.userdocks.getToken();
    });

    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.userdocks).toBeTruthy();
  });
});
