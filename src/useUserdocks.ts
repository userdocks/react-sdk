import { useContext } from 'react';
import { IIdentity, UserdocksContext } from './UserdocksProvider';

const useUserdocks = (): IIdentity => useContext(UserdocksContext);

export default useUserdocks;
