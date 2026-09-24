import React, { createContext } from 'react';

export interface AuthContextInterface {
    checkingSession: boolean;
    token: string | null;
    idToken: string | null;
    expiresAt: number | null;
    isAuthenticated: boolean;
    handleAuthentication: () => void;
    login: () => void;
    logout: () => void;
}

export const authContextDefaults: AuthContextInterface = {
    checkingSession: false,
    expiresAt: null,
    token: null,
    idToken: null,
    isAuthenticated: true,
    handleAuthentication: () => null,
    login: () => null,
    logout: () => null
};

type Props = {
    children: React.ReactNode;
};

const AuthContext = createContext<AuthContextInterface>(authContextDefaults);

export const AuthProvider = ({ children }: Props): React.ReactElement => {
    return <AuthContext.Provider value={authContextDefaults}>{children}</AuthContext.Provider>;
};

export default AuthContext;
