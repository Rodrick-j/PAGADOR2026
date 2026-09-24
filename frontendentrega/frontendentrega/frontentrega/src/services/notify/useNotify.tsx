import * as React from 'react';
import { NotifyContext, Notify } from './NotifyProvider';

export const useNotify = (): Notify => {
    return React.useContext(NotifyContext);
};
