import * as React from 'react';
import { SessionInfo, getSessionInfoFromLocalStorage } from 'services/auth/AuthService';

const initialValue: SessionInfo = {
    id_usuario: '',
    genero    : '',
    avatar    : '',
    nombre    : '',
    permisos  : {},
    roles     : '',
    celular   : '',
    area      : '',
    cargo     : '',
    modulos   : [],
    is_jefe   : false,
    username  : ''
};

export const SessionContext = React.createContext<SessionInfo>(initialValue);

type Props = {
    children: React.ReactNode;
};

export const SessionProvider = ({ children }: Props): React.ReactElement => {
    const sessionInfo: SessionInfo = getSessionInfoFromLocalStorage() || initialValue;
    return <SessionContext.Provider value={sessionInfo}>{children}</SessionContext.Provider>;
};
