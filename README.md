# **@userdocks/react-sdk**

![npm](https://img.shields.io/npm/v/@userdocks/react-sdk?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/userdocks/react-sdk/build?style=flat-square)
![Coveralls branch](https://img.shields.io/coveralls/github/userdocks/react-sdk/main?style=flat-square)
![NPM](https://img.shields.io/npm/l/@userdocks/react-sdk?style=flat-square)

> The React web client SDK for userdocks. Securly store, access, and refresh access tokens in your React application.

## Table of Contents

- [Install](#install)
- [Methods](#methods)
  - [useUserdocks](#useUserdocks)
- [Usage](#usage)

## **Install**

```bash
npm i @userdocks/react-sdk
```

## **Methods**

Documentation of all the functions and methods this SDK exposes.

## **UserdocksProvider**

**Syntax**

```jsx
import { UserdocksProvider } from '@userdocks/react-sdk';

render(
  <UserdocksProvider options={options}>
    {children}
  </UserdocksProvider>
);
```

**Parameters**

- **options** `<object>`: an object holding two key value pairs
  - **authServer** `<object | undefined>`: an object holding four key value pairs
    - **domain** `<string | undefined>`: the domain of the authetication server (_optional_)
    - **apiUri** `<string | undefined>`: the uri of the api of the authetication server (_optional_)
    - **paymentUri** `<string | undefined>`: the uri of the payment page of the authetication server (_optional_)
    - **loginUri** `<string | undefined>`: the uri of the login page of the authetication server (_optional_)
    - **sdkUri** `<string | undefined>`: the uri of the SDK of the authetication server (_optional_)
  - **app** `<object>`: an object holding three key value pairs
    - **refreshType**: `<'silentRefresh' | 'refresh'>`: How to refresh your authorization tokens (_optional_)
      - *silentRefresh*: uses cookies and an iframe for refreshing the tokens (authServer is required with this option)
      - *refresh*: uses the localStorage or sessionStorage (only for the refresh token, the access token is only stored in memory) and an HTTP request to refresh the tokens (default value)
    - **origin** `<string>`: the uri of the client application (_required_)
    - **clientId** `<string>`: the UUID of an userdocks application (_required_)
    - **redirectUri** `<string>`: the redirect uri of the userdocks application (_required_)

## **useUserdocks**

This custom hook returns an object.

It can be used in function components.

**Syntax**

This is a custom hook to get the current userdocks object from a UserdocksProvider.

```js
import { useUserdocks } from '@userdocks/react-sdk';

function MyComponent() {
  const { isLoading, initializeToken, isAuthenticated, userdocks } = useUserdocks();
  console.log('Is user authenticated: ', isAuthenticated)

  // ...
}
```

**Return Value**

- **identity** `<object>`
  - **isLoading** `<boolean>`: indicating if userdocks is ready for usage
  - **initializeToken** `<() => Promise<void>>`: stores the token in-memory or refreshes the token and stores it (uses a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) when available)
  - **isAuthenticated** `<boolean | null>`: indicating if the user is autheticated after the token is initialized (is null if not initialized)
  - **userdocks** `<object | null>`: an object holding the [@userdocks/web-client-sdk](https://github.com/userdocks/web-client-sdk#getuserdocks)

## **Usage**

Wrap your app with a `UserdocksProvider`:

```jsx
import { UserdocksProvider } from '@userdocks/react-sdk';

const options = {
  // e.g. if using a cname
  authServer: {
    domain: `<domain-of-the-auth-server>`
    apiUri: '<the-payment-uri-of-your-application>',
    paymentUri: '<the-payment-uri-of-your-application>',
    loginUri: '<the-payment-uri-of-your-application>',
    sdkUri: '<the-payment-uri-of-your-application>',
  },
  app: {
    refreshToken: '<refresh> or <silentRefresh>'
    origin: '<the-uri-of-your-application>',
    clientId: '<an-uuid-of-an-application-on-uderdocks>',
    redirectUri: '<the-redirect-uri-of-your-application>',
  },
};

render(
  <UserdocksProvider options={options}>
    <App />
  </UserdocksProvider>
);
```

Exchange the code to a token on your redirect uri:

```jsx
import { useEffect, FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserdocks } from '@userdocks/react-sdk';

const Callback = () => {
  const { isLoading, userdocks } = useUserdocks();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        if (userdocks && !isLoading) {
          const isLoginSuccess = await userdocks.exchangeCodeForToken();

          if (isLoginSuccess) {
            history.replace('/autheticated-component');
          } else {
            userdocks.redirectTo({ type: 'signIn' });
          }
        }
      } catch (e) {
        console.error(e);

        // handle error or redirect to sign in page
        // if (userdocks) {
        //   userdocks.redirectTo({ type: 'signIn' });
        // }
      }
    })();
  }, [isLoading, userdocks]);

  return null;
};

export default Callback;
```

Check if a user is autheticated on any component:

```jsx
import { useEffect, FC } from 'react';
import { useHistory } from 'react-router-dom';
import useUserdocks from '@userdocks/react-sdk';

const AnyComponent = () => {
  const { isLoading, isAutheticated, userdocks } = useUserdocks();
  const history = useHistory();

 // Example API Call to your server
  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        await authorize();
      }

      const token = await userdocks.getToken();

      if (!token.accessToken) {
        userdocks.redirectTo({
          type: 'signIn',
        });
      }

      if (token.tokenType && token.accessToken) {
        try {
          const response = await fetch('https://example.api.com/v1/users', {
            headers: {
              'Authorization': `${token.tokenType} ${token.accessToken}`,
            },
          });

          const data = await response.json();

          // do something with the data
        } catch(err) {
          // handle error
        }
      }
    })();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Is Loading...</div>;
  }

  if (isAutheticated === false) {
    userdocks.redirectTo('signIn');

    return null;
  }

  return <div>Is Autheticated</div>;
};

export default AnyComponent;
```
