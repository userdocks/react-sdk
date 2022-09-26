import userdocksSdk, { IOptions } from '@userdocks/web-client-sdk';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export interface IIdentity {
  isLoading: boolean;
  userdocks: typeof userdocksSdk | null;
  isAuthenticated: boolean | null;
  authorize: () => Promise<void>;
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
  authorize: () => Promise.resolve(),
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

  const authorize = async () => {
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

    if (options.selfhosted) {
      // const userdocksObject = window.userdocks || userdocksSdk;

      initializeUserdocks(userdocksSdk);

      return;
    }

    const script = document.createElement('script');
    const sdkUrl = options?.authServer?.sdkUri || 'https://sdk.userdocks.com';

    script.type = 'text/javascript';
    script.src = `${sdkUrl}/identity.js`;
    script.async = true;

    script.onload = async () => {
      if (!window.userdocks) {
        return;
      }

      initializeUserdocks(window.userdocks);
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }, [options.selfhosted, userdocks]);

  if (!children) {
    return null;
  }

  return (
    <UserdocksContext.Provider
      value={{
        isLoading: !userdocks,
        userdocks,
        isAuthenticated,
        authorize,
      }}
    >
      {children}
    </UserdocksContext.Provider>
  );
}

export default UserdocksProvider;
