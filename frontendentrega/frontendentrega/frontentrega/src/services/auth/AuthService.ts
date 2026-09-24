import { TOKEN_KEY } from 'config/app-config';
import { jwtDecode } from 'jwt-decode';
import { BaseService } from 'services/base/BaseService';
import { BaseResponse } from 'services/base/Types';

export type Permiso = {
    read    ?: boolean;
    create  ?: boolean;
    edit    ?: boolean;
    remove  ?: boolean;
    send    ?: boolean;
    download?: boolean;
    approve ?: boolean;
    lock    ?: boolean;
};

export type SessionInfo = {
    id_usuario: string;
    nombre    : string;
    avatar    : string;
    username  : string;
    genero    : string;
    permisos  : Permiso;
    roles     : string;
    celular   : string;
    area      : string;
    cargo     : string;
    is_jefe   : boolean;
    modulos   : string[];
};

export const registerLogin = (token: string, sessionInfo: SessionInfo): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('auth', JSON.stringify(sessionInfo));
};

export const registerLogout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('auth');
    localStorage.removeItem('dashboardMenu');
    localStorage.removeItem('CD');
};

export const getTokenFromLocalStorage = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getSessionInfoFromLocalStorage = (): SessionInfo | null => {
    const item = localStorage.getItem('auth');
    return item ? (JSON.parse(item) as SessionInfo) : null;
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            // Token expirado: limpiar sesión
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('sessionInfo');
            localStorage.removeItem('dashboardMenu');
            return false;
        }
        return true;
    } catch (e) {
        // Token inválido o mal formado
        localStorage.clear();
        return false;
    }
};

export const doSignIn = async (
    email: string,
    password: string
): Promise<BaseResponse<unknown>> => {
    try {
        // Realiza la autenticación contra la API principal
        const loginResponse = await BaseService.request<{ token: string }>('post', '/users/login', { email, password });
        if (!loginResponse.success || !loginResponse.data) {
            throw new Error(loginResponse.msg);
        }

        const token = loginResponse.data.token;
        localStorage.setItem(TOKEN_KEY, token);

        // Obtiene la información de sesión
        const sessionResp = await BaseService.request<SessionInfo>('get','/users/session-info?register=true');
        if (!sessionResp.success || !sessionResp.data) {
            throw new Error(sessionResp.msg);
        }

        registerLogin(token, sessionResp.data);
        const modulos = sessionResp.data.modulos || [];
        localStorage.setItem('dashboardMenu', JSON.stringify(modulos));
        return BaseService.sendSuccess();
    } catch (err: any) {
        registerLogout();
        BaseService.log(err);
        return BaseService.sendError({ msg: err.message || 'Error de autenticación' });
    }
};

export const doSignInCD = async (jwtToken: string): Promise<BaseResponse<unknown>> => {
    try {
        // 🔹 Iniciar sesión en jwt con el Custom Token
        if (!jwtToken) throw new Error("Token inválido");

        // Guardar token para que BaseService lo use en siguientes requests
        localStorage.setItem(TOKEN_KEY, jwtToken);

        // Llamar al backend para obtener la sesión
        const sessionResp = await BaseService.request<SessionInfo>('get','/users/session-info?register=true');
        if (!sessionResp.success || !sessionResp.data)  throw new Error(sessionResp.msg);

        // Registrar sesión en frontend
        registerLogin(jwtToken, sessionResp.data);

        // Guardar módulos disponibles para el usuario
        const modulos: string[] = sessionResp.data?.modulos || [];
        localStorage.setItem("dashboardMenu", JSON.stringify(modulos));

        return BaseService.sendSuccess();
    } catch (err) {
        doSignOut();
        BaseService.log(err);
        return BaseService.sendError({ msg: "Error en la autenticación con Ciudadanía Digital" });
    }
};

export const doSignOut = async (): Promise<BaseResponse<unknown>> => {
    registerLogout();
    return BaseService.sendSuccess();
};

export const auth = { doSignIn, doSignOut };
