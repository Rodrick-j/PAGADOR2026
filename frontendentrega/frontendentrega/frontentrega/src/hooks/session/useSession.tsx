import * as React from 'react';
import { SessionInfo } from 'services/auth/AuthService';
import { SessionContext } from './SessionProvider';

export const useSession = (): SessionInfo => {
    return React.useContext(SessionContext);
};
