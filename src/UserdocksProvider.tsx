import userdocks, { IOptions } from '@userdocks/web-client-sdk';
import { createContext, PropsWithChildren, useState } from 'react';

export interface IIdentity {
  userdocks: Omit<typeof userdocks, 'initialize'> & { initialize: () => Promise<void> };
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

function UserdocksProvider({
  children,
  options,
}: PropsWithChildren<UserdocksProviderProps>): JSX.Element | null {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const getToken: typeof userdocks.getToken = async (tokenOptions) => {
    const token = await userdocks.getToken(tokenOptions);
    setIsAuthenticated(!!token?.expiresIn);

    return token;
  };

  const initialize = async () => {
    await userdocks.initialize(options);
  }

  if (!children) {
    return null;
  }

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
