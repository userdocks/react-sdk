import getUserdocks from '@userdocks/web-client-sdk';
import { IOptions } from '@userdocks/web-client-sdk/dist/types';

const getIdentity = async (options: IOptions) => {
  const identity = await getUserdocks(options);

  return identity;
};

export default getIdentity;
