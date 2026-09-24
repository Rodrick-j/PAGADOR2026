import nodemailer from "nodemailer";

import { BaseService } from "../../../../base/domain/BaseService";
import { Result } from "../../../../base/types/Result";
import { DeviceInfo } from "../../../../base/types/DeviceInfo";

import { ageticConfig, CORREO, WEB_CLIENT_URL } from "../../../../config/app-config";
import { construirNombre, construirNombrePorApellido, eliminaRepetidos } from "../../../../tools/util";

import { UsuarioEntity, UsuarioProps } from "./UsuarioEntity";
import { IUsuarioRepository } from "./infra/IUsuarioRepository";
import { ID_TECNICO } from "../../../../base/constants/auth";
import RoleService from "../role";
import axios from "axios";
import qs from "qs";

export type CreaUsuarioParams = {
    email: string;
    displayName: string;
    password: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    ci: string;
    direccion: string;
    celular: string;
    genero: string;
    avatar?: string;
    isJefe?: boolean;
    roleId: string;
    devices?: DeviceInfo[];
};

export type EditaUsuarioParams = {
    id?: string;
    email?: string;
    displayName?: string;
    password?: string;
    nombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    ci?: string;
    direccion?: string;
    celular?: string;
    genero?: string;
    ciudad?: string;
    roleId?: string;
    avatar?: string;
    isJefe?: boolean;
    devices?: DeviceInfo[];
    estado?: "ACTIVO" | "INACTIVO";
};

export type UsuarioResources = {
    usuarios?: UsuarioEntity[];
};
export class UsuarioService extends BaseService<UsuarioEntity, UsuarioProps> {
    public constructor(repo: IUsuarioRepository) {
        super(repo);
    }
    public async factory(props: UsuarioProps, id?: string): Promise<Result<UsuarioEntity>> {
        return UsuarioEntity.create(props, id);
    }

    public async desactivarUsuario(): Promise<Result<boolean>> {
        const usuario = await this.repo.getAll({ activo: true });
        const result = await Promise.all(
        usuario.getValue().map((a) =>
            super.update(a.id, { activo: false })
        )
        );

        const failure = result.find(r => r.isFailure);

        if (failure) {
        return Result.fail(failure.error);
        }

        return Result.ok();
    }

    public async registrarUsuario(params: CreaUsuarioParams): Promise<Result<UsuarioEntity>> {
        const ID_ROLE = ID_TECNICO;
        //TO DO
        return super.create({
            username: params.email,
            password: params.password,
            fullname: construirNombrePorApellido(params.nombre, params.primerApellido, params.segundoApellido),
            nombre: params.nombre,
            primerApellido: params.primerApellido,
            segundoApellido: params.segundoApellido,
            ci: params.ci,
            email: params.email,
            direccion: params.direccion,
            celular: params.celular,
            genero: params.genero,
            roleId: ID_ROLE,
            estado: "ACTIVO",
            activo: true,
            avatar: params.avatar,
        });
    }

    public async creaUsuario(params: CreaUsuarioParams): Promise<Result<UsuarioEntity>> {
        const usuariosR = await super.getAll();
        if (usuariosR.isFailure) return Result.fail(usuariosR.error);

        const newUsername = params.email;
        const existeUsuarioDB = usuariosR.getValue().find((user) => user.props.username === newUsername);
        const userCreateResult = existeUsuarioDB
            ? await super.update(existeUsuarioDB.id, {
                  estado: "ACTIVO",
                  activo: true,
              })
            : await super.create({
                  username: params.email,
                  password: params.password,
                  fullname: construirNombrePorApellido(params.nombre, params.primerApellido, params.segundoApellido),
                  nombre: params.nombre,
                  primerApellido: params.primerApellido,
                  segundoApellido: params.segundoApellido,
                  ci: params.ci,
                  email: params.email,
                  direccion: params.direccion,
                  celular: params.celular,
                  genero: params.genero,
                  roleId: params.roleId,
                  isJefe: params.isJefe,
                  estado: "ACTIVO",
                  activo: true,
                  avatar: params.avatar,
              });

        if (userCreateResult.isFailure) return Result.fail(userCreateResult.error);

        return userCreateResult;
    }

    public async editaUsuario(params: EditaUsuarioParams): Promise<Result<UsuarioEntity>> {
        const ID_USER = params.id || "";
        const usuarioGetResult = await super.getById(ID_USER);
        if (usuarioGetResult.isFailure) return Result.fail(usuarioGetResult.error);
        const usuario = usuarioGetResult.getValue();

        const nuevoRolesID = params.roleId || usuario.props.roleId;

        const rolesGetResult = await RoleService.getById(nuevoRolesID);
        if (rolesGetResult.isFailure) return Result.fail(rolesGetResult.error);
        /* const nuevoRoles = rolesGetResult.getValue().props.tipo;
        const nuevoPermisos = rolesGetResult.getValue().props.permisos; */
        const nuevoEstado = params.estado || usuario.props.estado;
        const newProps = {
            username: params.email || usuario.props.username,
            email: params.email || usuario.props.username,
            displayName: construirNombre(
                params.nombre || usuario.props.nombre,
                params.primerApellido || usuario.props.primerApellido,
            ),
            fullname: construirNombre(
                params.nombre || usuario.props.nombre,
                params.primerApellido || usuario.props.primerApellido,
                params.segundoApellido || usuario.props.segundoApellido,
            ),
            nombre: params.nombre || usuario.props.nombre,
            primerApellido: params.primerApellido || usuario.props.primerApellido,
            segundoApellido: params.segundoApellido || usuario.props.segundoApellido,
            ci: params.ci || usuario.props.ci,
            direccion: params.direccion || usuario.props.direccion,
            celular: params.celular || usuario.props.celular,
            genero: params.genero || usuario.props.genero,
            roleId: nuevoRolesID,
            estado: nuevoEstado,
            isJefe: params.isJefe,
            activo: nuevoEstado === "ACTIVO",
            avatar: params.avatar || usuario.props.avatar,
            devices: params.devices || usuario.props.devices,
        };

        return super.update(ID_USER, {
            username: newProps.username,
            fullname: newProps.fullname,
            nombre: newProps.nombre,
            primerApellido: newProps.primerApellido,
            segundoApellido: newProps.segundoApellido,
            email: newProps.email,
            direccion: newProps.direccion,
            celular: newProps.celular,
            genero: newProps.genero,
            roleId: newProps.roleId,
            estado: newProps.estado,
            activo: newProps.activo,
            isJefe: newProps.isJefe,
            avatar: newProps.avatar,
            devices: newProps.devices,
        });
    }

    public async eliminaUsuario(usuarioId: string): Promise<Result<boolean>> {
        return super.delete(usuarioId);
    }

    /* METODOS INTERNOS DEL SERVICES USER */
    public async removerDispositivoDeLaLista(userId: string, deviceToken: string): Promise<Result<UsuarioEntity>> {
        const userR = await super.getById(userId);
        if (userR.isFailure) return Result.fail(userR.error);

        const currentDevices = userR.getValue().props.devices || [];
        const newDevices = currentDevices.filter((deviceInfo) => deviceInfo.token !== deviceToken);

        return super.update(userId, { devices: newDevices });
    }

    public async adicionarDispositivoALaLista(userId: string, deviceInfo: DeviceInfo): Promise<Result<UsuarioEntity>> {
        const userR = await super.getById(userId);
        if (userR.isFailure) return Result.fail(userR.error);

        const currentDevices = userR.getValue().props.devices || [];
        const newDevices = currentDevices.concat([deviceInfo]);

        const tokensValidos = eliminaRepetidos(newDevices.map((d) => d.token));
        const devices = tokensValidos.map((token) => newDevices.find((d) => d.token === token));

        return super.update(userId, { devices: devices });
    }

    public async findByEmail(email: string): Promise<Result<UsuarioEntity>> {
        const usuarios = await this.getAll();

        if (usuarios.isFailure) return Result.fail(usuarios.error);
        const usuario = usuarios.getValue().find((u) => u.props.username === email);

        if (!usuario) return Result.fail("Usuario no encontrado con ese email:" + email);
        return Result.ok(usuario);
    }

    private async sendResetPasswordEmail(email: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `Gobierno Autónomo Departamental de Oruro - <${CORREO.auth.user}>`,
                replyTo: CORREO.auth.user,
                to: email,
                subject: "Credenciales de acceso",
                html:
                    "<html>" +
                    "<body>" +
                    "<h2>¡Tu contraseña ha sido cambiada exitosamente!</h2>" +
                    "<p>Este correo electrónico confirma que se ha cambiado su contraseña.</p>" +
                    "<p>Para iniciar sesión en el sitio " +
                    WEB_CLIENT_URL +
                    ", use las siguientes credenciales:</p>" +
                    "<table><tr><td><b>Usuario: </b></td>" +
                    "<td>" +
                    email +
                    "</td></tr><tr><td>" +
                    "<b>Contraseña: </b>" +
                    "</td><td>" +
                    password +
                    "</td>" +
                    "</tr></table>" +
                    "<p>Si tiene alguna pregunta o tiene algún problema para iniciar sesión, comuníquese con un administrador del sitio.</p>" +
                    "</body></html>",
            };
            const transporter = nodemailer.createTransport(CORREO);
            transporter.sendMail(mailOptions, (error: any) => {
                if (error) {
                    console.log(`[email] error sending to "${email}" with pass "${password}"`);
                    return reject(error);
                }
                return resolve(true);
            });
        });
    }

    public async enviarCorreoUsuarios(usuariosId: string[], asunto: string, contenidoHtml: string): Promise<void> {
        const usuariosUnicos = eliminaRepetidos(usuariosId);

        for (const usuarioId of usuariosUnicos) {
            const usuario = await super.getById(usuarioId);
            if (usuario.getValue().props.email) {
                const mailOptions = {
                    from: `Gobierno Autónomo Departamental de Oruro - <${CORREO.auth.user}>`,
                    replyTo: CORREO.auth.user,
                    to: usuario.getValue().props.email,
                    subject: asunto,
                    html: `
                    <html>
                        <body>
                            <h2>${asunto}</h2>
                            <div>${contenidoHtml}</div>
                            <br/>
                            <p style="font-size: 12px; color: gray;">
                                Este mensaje fue enviado automáticamente desde el sistema de información del Gobierno Autónomo Departamental de Oruro.
                            </p>
                        </body>
                    </html>
                `,
                };

                const transporter = nodemailer.createTransport(CORREO);
                transporter.sendMail(mailOptions, (error: any) => {
                    if (error) {
                        console.error(`[email] Error al enviar a "${usuario.getValue().props.email}":`, error);
                    }
                });
            }
        }
    }

    public async cambiarContrasenia(userId: string, newPassword: string, sendEmail = false): Promise<Result<boolean>> {
        const userR = await super.getById(userId);
        if (userR.isFailure) return Result.fail(userR.error);

        const user = userR.getValue();
        const hashedPassword = newPassword;

        const updateR = await this.update(userId, { password: hashedPassword });
        if (updateR.isFailure) return Result.fail(updateR.error);

        if (sendEmail) {
            const email = user.props.email;
            this.sendResetPasswordEmail(String(email), newPassword).catch((err) => console.log(err));
        }

        return Result.ok(true);
    }

    public async intercambiarCodePorToken(code: string): Promise<Result<{ access_token: string; id_token: string }>> {
        try {
            const tokenResponse = await axios.post(
                ageticConfig.token_url,
                qs.stringify({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri : ageticConfig.redirect_uri,
                    client_id    : ageticConfig.client_id,
                    client_secret: ageticConfig.client_secret,
                }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            const { access_token, id_token } = tokenResponse.data;

            if (!access_token || !id_token) {
                return Result.fail("No se recibieron tokens válidos.");
            }

            return Result.ok({ access_token, id_token });
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : "Error desconocido.");
        }
    }

    public async getUserInfoCD(access_token: string): Promise<Result<any>> {
        try {
            const userInfoResponse = await axios.get(ageticConfig.me_url, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const user = userInfoResponse.data;

            if (!user || !user.email) {
                return Result.fail("No se pudo obtener la información del usuario.");
            }

            return Result.ok(user);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : "Error desconocido.");
        }
    }
}
