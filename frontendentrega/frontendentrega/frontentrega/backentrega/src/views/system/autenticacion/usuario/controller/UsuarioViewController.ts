import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import UsuarioView from "..";
import {
    GetUserFormDataResponse,
    GetUsersTableResponse,
    SessionInfoLoginCDResponse,
    SessionInfoLoginResponse,
    SessionInfoResponse,
} from "../UsuarioView";
import { construirNombre } from "../../../../../tools/util";
import { CreaUsuarioParams } from "../../../../../core/system/autenticacion/usuario/UsuarioService";
import { ID_TECNICO, PASSWORD_DEFAULT } from "../../../../../base/constants/auth";

import UsuarioService from "../../../../../core/system/autenticacion/usuario";
import PersonalService from "../../../../../core/rrhh/personal";
import RoleService from "../../../../../core/system/autenticacion/role";
import { AuthUser } from "../../../../../base/types/AuthUser";
import { signToken } from "../../../../../base/utils/jwt";
import { DeviceInfo } from "../../../../../base/types/DeviceInfo";

//import moment from "moment";

export class UsuarioViewController extends BaseHttpController {
    public async getSessionInfo(req: Request, res: Response): Promise<Response<SessionInfoResponse>> {
        if (!req.authId) return this.ok(res, { error: req.authError });
        const data = await UsuarioView.getSessionInfo(req.authUser);
        if (data.isFailure) return this.fail(res, String(data.error));
        return this.ok(res, data.getValue());
    }

    //Autenticacion por Login - API
    public async login(req: Request, res: Response): Promise<Response<any>> {
        const { email, password } = req.body;

        const usuario = await UsuarioView.validateLogin(email, password);
        if (usuario.isFailure) return this.fail(res, String(usuario.error));
        const usuarioResult = usuario.getValue();

        const role = await RoleService.getById(usuarioResult.props.roleId);
        if (role.isFailure) return this.fail(res, String(role.error));
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
        if (deviceResult.isFailure) return this.fail(res, String(deviceResult.error));

        return this.ok(res, { token });
    }

    //Autenticacion por Login - API
    public async getSessionInfoLogin(req: Request, res: Response): Promise<Response<SessionInfoLoginResponse>> {
        if (!req.authId) return this.ok(res, { error: req.authError });
        const data = await UsuarioView.getSessionInfoLogin(req.authUser);
        if (data.isFailure) return this.fail(res, String(data.error));
        return this.ok(res, data);
    }

    public async getUsersTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await UsuarioView.getUsersTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetUsersTableResponse>(res, data.getValue());
    }

    public async getUserFormData(req: Request, res: Response): Promise<any> {
        const formData = await UsuarioView.getUserFormDataView(req.params.user_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<GetUserFormDataResponse>(res, formData.getValue());
    }

    public async getAllUsuarios(req: Request, res: Response): Promise<any> {
        const result = await UsuarioView.getAllUsuarios();
        return this.ok<any>(res, result.getValue());
    }

    public async getAllUsuarioArea(req: Request, res: Response): Promise<any> {
        const result = await UsuarioView.getAllUsuarioArea(req.params.area_id);
        return this.ok<any>(res, result.getValue());
    }

    public async getAllUsuariosArea(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const result = await UsuarioView.getAllUsuariosArea(authUser);
        return this.ok<any>(res, result.getValue());
    }

    public async setAvatarUser(req: Request, res: Response): Promise<any> {
        const fileName = String(req.body.file_name);
        const usuarioId = req.authId;
        const result = await UsuarioService.editaUsuario({ id: usuarioId, avatar: fileName });
        if (result.isFailure) return this.fail(res, "Falló al cambiar avatar");
        return this.ok(res);
    }

    public async registerUser(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const usuariosR = await UsuarioService.getAll();
        if (usuariosR.isFailure) return Result.fail(usuariosR.error);

        // TODO
        const newUsername = data.email;
        const newCI = data.ci;
        const newTelefono = data.telefono;
        const existeUsuarioDB = usuariosR
            .getValue()
            .find(
                (user) =>
                    user.props.username === newUsername ||
                    user.props.ci === newCI ||
                    user.props.celular === newTelefono,
            );
        const existe = !!existeUsuarioDB;
        if (existe) return this.fail(res, "Los datos proporsionados ya estan registrados, consulte a RRHH");
        const { ci /* , telefono, primerApellido, segundoApellido, fechaNacimiento */ } = data;
        const persona = await PersonalService.getAll();
        if (persona.isFailure) return this.fail(res, "Error de persona");

        const personaResult = persona.getValue().find((p) => {
            /* const apMaterno = p.props.apellidoMaterno !== ""
                                ? p.props.apellidoMaterno.toLowerCase() === segundoApellido.toLowerCase()
                                : true;
                                const fecha1 = moment(p.props.fechaNacimiento);
                                const fecha2 = moment(fechaNacimiento); */
            const result = p.props.ci === ci;
            /* &&
                            p.props.telefono === telefono &&
                            fecha1.isSame(fecha2, 'day')
                            p.props.apellidoPaterno.toLowerCase() === primerApellido.toLowerCase() &&
                            apMaterno; */
            return result;
        });

        if (typeof personaResult === "undefined")
            return this.fail(res, "No existe la informacion proporcinada en el registro de RRHH.");
        const ID_PERSONAL = personaResult.id;

        const nom = personaResult.props.sexo === "MASCULINO" ? "h" : "m";
        const num: number = Math.floor(Math.random() * (4 - 1)) + 1;

        const formData: CreaUsuarioParams = {
            displayName: construirNombre(data.nombre, data.primerApellido, data.segundoApellido),
            ci: data.ci,
            email: data.email,
            password: data.password,
            nombre: personaResult.props.nombres,
            primerApellido: personaResult.props.apellidoPaterno,
            segundoApellido: personaResult.props.apellidoMaterno,
            direccion: personaResult.props.direccion,
            celular: data.telefono,
            genero: personaResult.props.sexo,
            roleId: ID_TECNICO,
            avatar: `avatar_${nom}${num}.png`,
        };
        const result = await UsuarioService.creaUsuario(formData);
        if (result.isFailure) return this.fail(res, String(result.error));
        const updateProps = {
            usuarioId: result.getValue().id,
        };

        const personalModificado = await PersonalService.update(ID_PERSONAL, updateProps);
        if (personalModificado.isFailure) return this.fail(res, String(personalModificado.error));

        return this.ok<any>(res, result);
    }

    public async createUser(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const nom = data.genero === "MASCULINO" ? "h" : "m";
        const num: number = Math.floor(Math.random() * (2 - 1)) + 1;
        const formData = {
            username: construirNombre(data.nombre, data.primer_apellido),
            displayName: construirNombre(data.nombre, data.primer_apellido, data.segundo_apellido),
            password: data.password,
            ci: data.ci,
            email: data.email,
            nombre: data.nombre,
            primerApellido: data.primer_apellido,
            segundoApellido: data.segundo_apellido,
            direccion: data.direccion,
            celular: data.telefono,
            genero: data.genero,
            isJefe: data.is_jefe,
            roleId: data.role_id,
            avatar: `avatar_${nom}${num}.png`,
        };
        const result = await UsuarioService.creaUsuario(formData);
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result);
    }

    public async updateUser(req: Request, res: Response): Promise<any> {
        const userId = req.authId;
        const data = req.body;
        const ID_USUARIO = data.id;
        if (ID_USUARIO === userId) return this.fail(res, "No puede modificar su propia cuenta de usuario");

        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) return this.fail(res, "El usuario no existe");

        const formData = {
            id: data.id,
            username: data.username,
            password: data.password,
            email: data.email,
            displayName: data.displayName,
            nombre: data.nombre,
            primerApellido: data.primer_apellido,
            segundoApellido: data.segundo_apellido,
            direccion: data.direccion,
            celular: data.telefono,
            genero: data.genero,
            roleId: data.role_id,
            isJefe: data.is_jefe,
            avatar: data.avatar,
        };
        const result = await UsuarioService.editaUsuario(formData);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyUser(req: Request, res: Response): Promise<any> {
        const userId = req.authId;
        const ID_USUARIO = req.params.user_id;
        if (ID_USUARIO === userId) return this.fail(res, "No puede eliminar su propia cuenta de usuario");
        const usuarioR = await UsuarioService.getById(ID_USUARIO);
        if (usuarioR.isFailure) return this.fail(res, String(usuarioR.error));

        const result = await UsuarioService.eliminaUsuario(ID_USUARIO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const userId = req.authId;
        const usuarioId = req.params.user_id;
        const activo = Boolean(req.body.activo);

        if (usuarioId === userId) return this.fail(res, "No puede cambiar el estado de su propia cuenta");

        const result = await UsuarioService.editaUsuario({ id: usuarioId, estado: activo ? "ACTIVO" : "INACTIVO" });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    /** Restaura la contraseña de un usuario (desde el administrador) */
    public async resetPassword(req: Request, res: Response): Promise<any> {
        const usuarioId = req.params.user_id;

        const userResult = await UsuarioService.getById(usuarioId);
        if (userResult.isFailure) return this.fail(res, String(userResult.error));
        // El nuevo password sera CI del personal
        const RANDOM_STRING = userResult.getValue().props.ci ? userResult.getValue().props.ci : PASSWORD_DEFAULT;

        const newPassword = RANDOM_STRING;
        const updateR = await UsuarioService.cambiarContrasenia(usuarioId, newPassword, true);
        if (updateR.isFailure) return this.fail(res, String(updateR.error));
        return this.ok(res);
    }

    public async changeAuthenticatedUserPassword(req: Request, res: Response): Promise<any> {
        const ID_USUARIO = req.authId;
        const newPassword = req.body.password;
        const updateR = await UsuarioService.cambiarContrasenia(ID_USUARIO, newPassword, true);
        if (updateR.isFailure) return this.fail(res, String(updateR.error));
        return this.ok(res, { msg: "ok" });
    }

    public async getUsuarioArea(req: Request, res: Response): Promise<any> {
        const usuarioArea = await UsuarioView.getUsuarioArea();
        if (usuarioArea.isFailure) return this.fail(res, "Falló al obtener el usuario ");
        return this.ok<any>(res, usuarioArea.getValue());
    }

    public async getSessionInfoLoginCD(req: Request, res: Response): Promise<Response<SessionInfoLoginCDResponse>> {
        const { token, user } = req.authUser;
        return this.ok(res, { token, user });
    }
}
