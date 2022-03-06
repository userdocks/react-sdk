import { IToken, TUserdocks } from '@userdocks/web-client-sdk/dist/types';

const refreshOrPipeTokenThrough = async (
  token: IToken,
  userdocks: TUserdocks
) => {
  let thisToken = token;

  if ((token.expiresIn as number) <= 0) {
    const isSilentRefresh = await userdocks.silentRefresh();

    if (isSilentRefresh) {
      thisToken = await userdocks.getToken();
    } else {
      userdocks.redirectTo('signIn');
    }
  }

  return thisToken;
};

export default refreshOrPipeTokenThrough;
