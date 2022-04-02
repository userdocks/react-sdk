import { IToken, TUserdocks } from '@userdocks/web-client-sdk/dist/types';

let globalPromise: Promise<Boolean>;
let renewPromise = true;

const refreshOrPipeTokenThrough = async (
  token: IToken,
  userdocks: TUserdocks
) => {
  let thisToken = token;

  if ((token.expiresIn as number) <= 0) {
    if (renewPromise) {
      renewPromise = false;

      globalPromise = new Promise(async resolve => {
        try {
          const isSilentRefresh = await userdocks.silentRefresh();

          resolve(isSilentRefresh);
        } catch {
          renewPromise = true;
          resolve(false);
        }
      });
    }

    const result = await globalPromise;

    renewPromise = true;

    if (result) {
      thisToken = await userdocks.getToken();
    } else {
      userdocks.redirectTo('signIn');
    }
  }

  return thisToken;
};

export default refreshOrPipeTokenThrough;
