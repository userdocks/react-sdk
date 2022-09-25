import userdocks from '@userdocks/web-client-sdk';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    userdocks: typeof userdocks | undefined;
  }
}

window.userdocks = undefined;
