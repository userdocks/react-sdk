import userdocks, { IOptions } from '@userdocks/web-client-sdk';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';

export interface IIdentity {
  userdocks: Omit<typeof userdocks, 'initialize'> & {
    initialize: () => Promise<void>;
  };
  isAuthenticated: boolean | null;
}

interface UserdocksProviderProps {
  options: IOptions;
}

export const UserdocksContext = createContext<IIdentity>({
  isAuthenticated: null,
  userdocks,
});

export const UserdocksConsumer = UserdocksContext.Consumer;

const wait = (delay: number) =>
  new Promise(res => {
    setTimeout(res, delay);
  });

function UserdocksProvider({
  children,
  options,
}: PropsWithChildren<UserdocksProviderProps>): JSX.Element | null {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const getToken = useCallback<typeof userdocks.getToken>(
    async tokenOptions => {
      const waitForInitialization = async () => {
        let count = 1;

        while (!userdocks.isInitialized()) {
          count += 1;

          // wait longer the more it retries
          await wait(5 * count);
        }
      };

      // wait a maximum of 1second until it is initialized
      await Promise.race([wait(1000), waitForInitialization()]);

      const token = await userdocks.getToken(tokenOptions);

      setIsAuthenticated(!!token?.expiresIn);

      return token;
    },
    []
  );

  const initialize = useCallback(async () => {
    await userdocks.initialize(options);
  }, []);

  return (
    <UserdocksContext.Provider
      value={{
        userdocks: {
          ...userdocks,
          initialize,
          getToken,
        },
        isAuthenticated,
      }}
    >
      {children}
    </UserdocksContext.Provider>
  );
}

export default UserdocksProvider;
