import userdocksSdk, { IOptions } from '@userdocks/web-client-sdk';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export interface IIdentity {
  isLoading: boolean;
  userdocks: typeof userdocksSdk | null;
  isAuthenticated: boolean;
}

interface UserdocksProviderProps {
  options: IOptions & {
    selfhosted?: boolean;
  };
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
  const [userdocks, setUserdocks] = useState<typeof userdocksSdk | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeUserdocks = async (userdocksObject: typeof userdocksSdk) => {
    await userdocksObject.initialize(options);
    const token = await userdocksObject.getToken({ refresh: true });

    setUserdocks(userdocksObject);
    setIsAuthenticated(!!token?.expiresIn);
    setIsLoading(false);
  };

  useEffect(() => {
    if (userdocks) {
      return;
    }

    setIsLoading(true);

    if (options.selfhosted) {
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
      value={{ isLoading, userdocks, isAuthenticated }}
    >
      {children}
    </UserdocksContext.Provider>
  );
}

export default UserdocksProvider;
