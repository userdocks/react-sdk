import { useEffect, useState } from 'react';
import getUserdocks from '@userdocks/web-client-sdk';
import { IOptions, TUserdocks } from '@userdocks/web-client-sdk/dist/types';

import getNaiveCache from './getNaiveCache';
import refreshOrPipeTokenThrough from './refreshTokenOrPipeThrough';

interface IIdentity {
  clear: () => void;
  isLoading: boolean;
  userdocks: TUserdocks | null;
  isAuthenticated: boolean;
}

const getIdentity = async (options: IOptions) => {
  const identity = await getUserdocks(options);

  return identity;
};

const userdocksCache = getNaiveCache<TUserdocks>('userdocks');

const useUserdocks = (options: IOptions) => {
  const [identity, setIdentity] = useState<IIdentity>({
    isLoading: true,
    userdocks: userdocksCache.get(),
    isAuthenticated: false,
    clear: () => {
      userdocksCache.clear();
      setIdentity({
        clear: identity.clear,
        isLoading: true,
        userdocks: userdocksCache.get(),
        isAuthenticated: false,
      });
    },
  });

  useEffect(() => {
    (async () => {
      setIdentity({
        ...identity,
        isLoading: true,
      });

      if (!identity.userdocks) {
        const userdocks = await getIdentity(options);
        let token = await userdocks.getToken();
        token = await refreshOrPipeTokenThrough(token, userdocks);

        userdocksCache.set(userdocks);

        setIdentity({
          ...identity,
          isLoading: false,
          userdocks,
          isAuthenticated:
            token && (token.expiresIn ? token.expiresIn > 0 : false),
        });
      } else {
        let token = await identity.userdocks.getToken();
        token = await refreshOrPipeTokenThrough(token, identity.userdocks);

        setIdentity({
          ...identity,
          isLoading: false,
          isAuthenticated:
            token && (token.expiresIn ? token.expiresIn > 0 : false),
        });
      }
    })();
  }, []);

  return identity;
};

export default useUserdocks;
