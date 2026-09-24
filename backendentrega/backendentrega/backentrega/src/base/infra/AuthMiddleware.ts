import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { signToken, verifyToken } from "../utils/jwt";
import { AuthUser } from "../types/AuthUser";
//@ADMIN
import UsuarioService from "../../core/system/autenticacion/usuario";
import AccesoService from "../../core/system/autenticacion/acceso";
import RoleService from "../../core/system/autenticacion/role";
import BitacoraService from "../../core/system/auditoria/bitacora";

import { DeviceInfo } from "../../base/types/DeviceInfo";
import UsuarioView from "../../views/system/autenticacion/usuario";

export const registerSesionActivity = async (req: Request, res: Response, next: NextFunction) => {
    // continua el flujo
    next();

    // proceso en segundo plano
    try {
        const authUser: AuthUser = req.authUser;
        if (!authUser || !authUser.uid) return;

        const fullPath: string = req.originalUrl || req.url || "";
        const pathWithoutQuery: string = fullPath.split("?")[0];

        const segments: string[] = pathWithoutQuery.split("/").filter(Boolean);
        let modulo: string | null = null;

        if (segments.length > 0) {
            if (segments[0] === "api" && segments.length > 1) {
                modulo = segments[1];
            } else {
                modulo = segments[0];
            }
        }

        const ip: string =
            (req.headers["x-forwarded-for"] as string) ||
            req.ip ||
            (req.connection && req.connection.remoteAddress) ||
            "";

        const result = await BitacoraService.register({
            usuarioId: authUser.uid,
            rol: authUser.roles || "-",
            ruta: pathWithoutQuery,
            metodo: req.method,
            ip,
            modulo,
        });

        if (result.isFailure) console.error("[BITACORA ERROR]", result.errorValue());
    } catch (e) {
        ({});
    }
};

const getAuthToken = (req: Request): string | null => {
    try {
        return String(req.headers.authorization).split(" ")[1];
    } catch (e) {
        return null;
    }
};

export const checkIfAuthenticatedLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = req.body;

    const usuario = await UsuarioView.validateLogin(email, password);
    if (usuario.isFailure) {
        return res.status(401).json({ error: usuario.error });
    }
    const usuarioResult = usuario.getValue();

    const authUser: AuthUser = {
        uid: usuarioResult.id,
        email: usuarioResult.props.username,
        user_id: usuarioResult.id,
        permisos: usuarioResult.props.permisos || {},
        roles: usuarioResult.props.role || "",
    };

    req.authId = authUser.uid;
    req.authUser = authUser;

    next();
};

export const checkIfAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = getAuthToken(req);
        if (!authToken) return res.status(401).json({ error: "Acceso no autorizado" });
        const authUser = verifyToken(authToken) as AuthUser;
        const usuario = await UsuarioService.getById(authUser.uid);
        if (usuario.isFailure) return res.status(401).json({ error: usuario.error });
        if (!usuario.getValue().props.activo) return res.status(403).json({ error: "Usuario inactivo" });
        req.authId = authUser.uid;
        req.authUser = authUser;
        return next();
    } catch (e) {
        return res.status(401).send({ error: String(e.message) });
    }
};

export const checkIfAuthenticatedLoginCD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "No se encontró el código de autorización." });

        const tokenResult = await UsuarioService.intercambiarCodePorToken(code);
        if (tokenResult.isFailure) return res.status(401).json({ error: tokenResult.error });

        const { access_token } = tokenResult.getValue();

        const userCDResult = await UsuarioService.getUserInfoCD(access_token);
        if (userCDResult.isFailure) return res.status(401).json({ error: userCDResult.error });

        const userCD = userCDResult.getValue();

        const usuario = await UsuarioService.findByEmail(userCD.email);
        if (usuario.isFailure) return res.status(403).json({ error: usuario.error });
        const usuarioResult = usuario.getValue();

        const role = await RoleService.getById(usuarioResult.props.roleId);
        if (role.isFailure) return res.status(403).json({ error: role.error });
        const rol = role.getValue().props.tipo;

        // asignar rol
        const userR: AuthUser = {
            uid: usuarioResult.id,
            email: usuarioResult.props.email,
            roles: rol,
            [rol]: rol,
        };

        const token: string = signToken(userR);

        const deviceInfo: DeviceInfo = {
            token,
            browser: String(req.useragent?.browser || ""),
            version: String(req.useragent?.version || ""),
            os: String(req.useragent?.os || ""),
            platform: String(req.useragent?.platform || ""),
            source: String(req.useragent?.source || ""),
        };

        const deviceResult = await UsuarioService.adicionarDispositivoALaLista(usuarioResult.id, deviceInfo);
        if (deviceResult.isFailure) {
            return res.status(500).json({ error: String(deviceResult.error) });
        }

        req.authUser = {
            token,
            user: userCD,
        };

        return next();
    } catch (e) {
        return res.status(401).json({ error: String(e.message) });
    }
};

export const checkIfAuthenticatedWithoutError = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = getAuthToken(req);
        if (!authToken) return res.status(401).json({ error: "Acceso no autorizado" });
        const authUser = verifyToken(authToken) as AuthUser;
        const usuario = await UsuarioService.getById(authUser.uid);
        if (usuario.isFailure) return res.status(401).json({ error: usuario.error });
        if (!usuario.getValue().props.activo) return res.status(403).json({ error: "Usuario inactivo" });
        req.authId = authUser.uid;
        req.authUser = authUser;
        return next();
    } catch (e) {
        req.authError = String(e.message);
        return next();
    }
};

export const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
    return checkIfAuthenticated(req, res, () => {
        const authUser = req.authUser;
        if (!authUser.administrador && !authUser.superadministrador)
            return res.status(403).send({ error: "Permisos insuficientes" });
        return next();
    });
};

export const checkIfSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    return checkIfAuthenticated(req, res, () => {
        const authUser = req.authUser;
        if (!authUser.superadministrador) return res.status(403).send({ error: "Permisos insuficientes" });
        return next();
    });
};

export const registerLogin = async (req: Request, res: Response, next: NextFunction) => {
    // continua el flujo
    next();

    // proceso en segundo plano
    try {
        if (!req.query.register || req.query.register !== "true") return;
        const authUser: AuthUser = req.authUser;
        const DEVICE_PROPS: DeviceInfo = {
            token: "",
            browser: String(req.useragent?.browser),
            version: String(req.useragent?.version),
            os: String(req.useragent?.os),
            platform: String(req.useragent?.platform),
            source: String(req.useragent?.source),
        };
        await AccesoService.create({
            fecha: moment().toDate(),
            device: DEVICE_PROPS,
            usuarioId: authUser.uid,
        });
    } catch (e) {
        ({});
    }
};
