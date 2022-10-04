import userdocksSdk, { IOptions } from '@userdocks/web-client-sdk';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export interface IIdentity {
  isLoading: boolean;
  userdocks: typeof userdocksSdk | null;
  isAuthenticated: boolean | null;
  initializeToken: () => Promise<void>;
}

interface UserdocksProviderProps {
  options: IOptions & {
    selfhosted?: boolean;
  };
}

export const UserdocksContext = createContext<IIdentity>({
  isAuthenticated: null,
  isLoading: true,
  userdocks: null,
  initializeToken: () => Promise.resolve(),
});

export const UserdocksConsumer = UserdocksContext.Consumer;

function UserdocksProvider({
  children,
  options,
}: PropsWithChildren<UserdocksProviderProps>): JSX.Element | null {
  const [userdocks, setUserdocks] = useState<typeof userdocksSdk | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const initializeUserdocks = async (userdocksObject: typeof userdocksSdk) => {
    await userdocksObject.initialize(options);

    setUserdocks(userdocksObject);
  };

  const initializeToken = async () => {
    if (!userdocks) {
      return;
    }

    const token = await userdocks.getToken({ refresh: true });

    setIsAuthenticated(!!token?.expiresIn);
  };

  useEffect(() => {
    if (userdocks) {
      return;
    }

      initializeUserdocks(userdocksSdk);

      return;
  }, [userdocks]);

  if (!children) {
    return null;
  }

  return (
    <UserdocksContext.Provider
      value={{
        isLoading: !userdocks,
        userdocks,
        isAuthenticated,
        initializeToken,
      }}
    >
      {children}
    </UserdocksContext.Provider>
  );
}

export default UserdocksProvider;
