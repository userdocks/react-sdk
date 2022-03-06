import getUserdocks from '@userdocks/web-client-sdk';
import { IToken, TUserdocks } from '@userdocks/web-client-sdk/dist/types';

import refreshTokenOrPipeThrough from '../src/refreshTokenOrPipeThrough';

jest.mock('@userdocks/web-client-sdk', () => async () => ({
  getToken: jest.fn().mockReturnValueOnce('new'),
  silentRefresh: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
  redirectTo: jest.fn(),
}));

let userdocks: TUserdocks;

beforeAll(async () => {
  userdocks = await getUserdocks();
});

describe('refreshTokenOrPipeThrough', () => {
  test('with zero expiration time on token and successful refresh should get new token', async () => {
    const expectedValue = 'new';

    const returnedValue = await refreshTokenOrPipeThrough(
      {
        expiresIn: 0,
        idToken: '1.2.3',
        accessToken: '1.2.3',
        redirectUri: 'https://redirect',
        tokenType: 'Bearer',
      },
      userdocks
    );

    expect(returnedValue).toBe(expectedValue);
  });
  test('with zero expiration time on token and unsuccessful refresh should redirect', async () => {
    const expectedValue = {
      expiresIn: 0,
      idToken: '1.2.3',
      accessToken: '1.2.3',
      redirectUri: 'https://redirect',
      tokenType: 'Bearer',
    };

    const returnedValue = await refreshTokenOrPipeThrough(
      expectedValue as IToken,
      userdocks
    );

    expect(returnedValue).toEqual(expectedValue);
  });
  test('with 20000ms expiration time on token should pipe through', async () => {
    const expectedValue = {
      expiresIn: 20000,
      idToken: '1.2.3',
      accessToken: '1.2.3',
      redirectUri: 'https://redirect',
      tokenType: 'Bearer',
    };
    const returnedValue = await refreshTokenOrPipeThrough(
      expectedValue as IToken,
      userdocks
    );

    expect(returnedValue).toBe(expectedValue);
  });
});
