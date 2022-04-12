import getUserdocks from '@userdocks/web-client-sdk';
import { IOptions, TUserdocks } from '@userdocks/web-client-sdk/dist/types';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export interface IIdentity {
  isLoading: boolean;
  userdocks: TUserdocks | null;
  isAuthenticated: boolean;
}

interface UserdocksProviderProps {
  options: IOptions;
}

export const UserdocksContext = createContext<IIdentity>({
  isAuthenticated: false,
  isLoading: true,
  userdocks: null,
});

export const UserdocksConsumer = UserdocksContext.Consumer;

function UserdocksProvider({
  children,
  options,
}: PropsWithChildren<UserdocksProviderProps>): JSX.Element | null {
  const [isLoading, setIsLoading] = useState(true);
  const [userdocks, setUserdocks] = useState<TUserdocks | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // initialize userdocks
  useEffect(() => {
    if (userdocks) {
      return;
    }

    setIsLoading(true);

    (async () => {
      const userdocksClient = await getUserdocks(options);
      const token = await userdocksClient.getToken({ refresh: true });

      setUserdocks(userdocksClient);
      setIsAuthenticated(!!token?.expiresIn);
      setIsLoading(false);
    })();
  }, [userdocks]);

  if (!children) {
    return null;
  }

  return (
    <UserdocksContext.Provider
      value={{ isLoading, userdocks, isAuthenticated }}
    >
      {children}
    </UserdocksContext.Provider>
  );
}

export default UserdocksProvider;
