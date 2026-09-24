import { AuthUser } from "../../../../base/types/AuthUser";
import { Result } from "../../../../base/types/Result";

import { findAndCountResult, toWordUpperFirstCase } from "../../../../tools/util";

import { Permiso } from "../../../../core/system/autenticacion/role/RoleEntity";

import UsuarioService from "../../../../core/system/autenticacion/usuario";
import RoleService from "../../../../core/system/autenticacion/role";
import RutaService from "../../../../core/system/autenticacion/ruta";

import { ID_SUPERADMIN } from "../../../../base/constants/auth";
import PersonalService from "../../../../core/rrhh/personal";
import AreaService from "../../../../core/rrhh/area";
import CargoService from "../../../../core/rrhh/cargo";
import bcrypt from 'bcryptjs';

export type SessionInfoResponse = {
    id_usuario : string;
    nombre     : string;
    avatar     : string;
    username   : string;
    is_jefe    : boolean;
    genero     : string;
    permisos   : Permiso | null;
    roles      : string;
    celular   ?: string | null;
    area      ?: string | null;
    cargo     ?: string | null;
    modulos    : string[];
};

export type SessionInfoLoginResponse = {
    id_usuario : string;
    nombre     : string;
    avatar     : string;
    username   : string;
    genero     : string;
    celular   ?: string | null;
    area      ?: string | null;
    cargo     ?: string | null;
};

export type SessionInfoLoginCDResponse = {
    id_usuario: string;
    nombre: string;
    avatar: string;
    username: string;
    genero: string;
    celular?: string | null;
};

type UserTableItem = {
    id     : string;
    activo : boolean;
    nombre : string;
    email  : string;
    roles  : string;
    is_jefe: boolean;
    estado : string;
};

export type GetUsersTableResponse = {
    rows: UserTableItem[];
    count: number;
};

export type GetUserFormParamsResponse = {
    roles: { id: string; nombre: string }[];
};

export type GetUserFormDataResponse = {
    id              : string;
    username        : string;
    email           : string;
    nombre          : string;
    primer_apellido : string;
    segundo_apellido: string;
    direccion       : string;
    role_id         : string;
    ci              : string;
    telefono        : string;
    genero          : string;
    is_jefe?        : string;
};

export type UsuarioOptionsFormModel = {
    id: string;
    nombre: string;
};

export type RegisterProps = {
    email: string;
    password: string;
    ci: string;
    telefono: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
};

export type UsuarioArea = {
    id       : string;
    nombre   : string;
    caption? : string;
};

/* TODO */
//const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>  obj[key];
export class UsuarioView {
    public async getSessionInfo(userInfo: AuthUser): Promise<Result<SessionInfoResponse>> {
        const ID_USER = userInfo.uid;
        const usuarioResult = await UsuarioService.getById(ID_USER);
        if (usuarioResult.isFailure) return Result.fail<SessionInfoResponse>("Usuario no encontrado");
        let areaResult = "SUPERADMIN";
        let cargoResult = "SUPER ADMINISTRADOR";
        if(!userInfo.superadministrador && !userInfo.administrador){
            const personal = await PersonalService.getAll();
            if (personal.isFailure) return Result.fail<SessionInfoResponse>("Personal no encontrado");
            const personalResult = personal.getValue().find((p) => p.props.activo && p.props.usuarioId === ID_USER);

            const area = await AreaService.getById(personalResult?.props.areaId || "");
            if (area.isFailure) return Result.fail<SessionInfoResponse>("Area no encontrada");
            areaResult = area.getValue().props.nombre;
            
            const cargo = await CargoService.getById(personalResult?.props.cargoId || "");
            if (cargo.isFailure) return Result.fail<SessionInfoResponse>("Cargo no encontrado");
            cargoResult = cargo.getValue().props.nombre;
        }

        const ID_ROLE = usuarioResult.getValue().props.roleId;
        const rolesResult = await RoleService.getById(ID_ROLE);
        if (rolesResult.isFailure) return Result.fail<SessionInfoResponse>("Role no encontrado");
        const rol = rolesResult.getValue();

        const usuario = usuarioResult.getValue();

        const response: SessionInfoResponse = {
            id_usuario: usuario.id.toString(),
            avatar    : usuario.props.avatar as string,
            username  : usuario.props.username,
            is_jefe   : usuario.props.isJefe || false,
            nombre    : "Anónimo",
            genero    : "NINGUNO",
            permisos  : null,
            celular   : null,
            area      : null,
            cargo     : null,
            roles     : "",
            modulos   : [],
        };
        
        const permisosObject: Permiso = (rol?.props.permisos && JSON.parse(rol?.props.permisos)) || {};
        const modulosObject: string[] = rol?.props.modulos || [];
        
        const rutas = await RutaService.getAll();
        if (rutas.isFailure) return Result.fail(rutas.error);
        const rutasResult = rutas.getValue();
        const modulos: any[] = [];

        modulosObject.map((e: any) => {
            const ruta = rutasResult.find((r) => r.id === e.id);
            if (ruta) {
                const propsRuta = {
                    id         : ruta.id,
                    name       : ruta.props.name,
                    path       : ruta.props.path,
                    title      : ruta.props.title,
                    descripcion: ruta.props.descripcion,
                    icon       : ruta.props.icon,
                    color      : ruta.props.color,
                    is_client  : ruta.props.isClient != null ? Boolean(ruta.props.isClient) : null,
                };
                modulos.push(propsRuta);
            }
            return;
        });

        response.genero   = usuario.props.genero;
        response.nombre   = usuario.getNombreConApellido();
        response.permisos = permisosObject;
        response.celular  = usuario.props.celular;
        response.area     = areaResult;       
        response.cargo    = cargoResult;  
        response.roles    = rol?.props.tipo || "";
        response.modulos  = modulos.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
        return Result.ok<SessionInfoResponse>(response);
    }

    public async validateLogin(email: string, password: string): Promise<Result<any>> {
        const user = await UsuarioService.findByEmail(email);

        if (user.isFailure) return Result.fail(user.error || 'Usuario no encontrado');

        const userResult = user.getValue();
        const isValid = await bcrypt.compare(String(password), userResult.props.password);

        if (!isValid) return Result.fail('Contraseña incorrecta');
        return Result.ok<any>(userResult);
    }
    
    //Autenticacion por Login - API
    public async getSessionInfoLogin(userInfo: AuthUser): Promise<Result<SessionInfoLoginResponse>> {
        const ID_USER = userInfo.uid;
        const usuarioResult = await UsuarioService.getById(ID_USER);
        if (usuarioResult.isFailure)  return Result.fail<SessionInfoLoginResponse>("Usuario no encontrado");

        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail<SessionInfoLoginResponse>("Personal no encontrado");
        const personalResult = personal.getValue().find((p) => p.props.activo && p.props.usuarioId === ID_USER);

        const area = await AreaService.getById(personalResult?.props.areaId || "");
        if (area.isFailure) return Result.fail<SessionInfoLoginResponse>("Area no encontrada");
        const areaResult = area.getValue().props.nombre;
        
        const cargo = await CargoService.getById(personalResult?.props.cargoId || "");
        if (cargo.isFailure) return Result.fail<SessionInfoLoginResponse>("Cargo no encontrado");
        const cargoResult = cargo.getValue().props.nombre;
        
        const usuario = usuarioResult.getValue();

        const response: SessionInfoLoginResponse = {
            id_usuario: usuario.id.toString(),
            avatar    : usuario.props.avatar as string,
            username  : usuario.props.username,
            nombre    : "Anónimo",
            genero    : "NINGUNO",
            celular   : null,
            area      : null,
            cargo     : null,
        };              

        response.genero   = usuario.props.genero;
        response.nombre   = usuario.getNombreConApellido();        
        response.celular  = usuario.props.celular;       
        response.area     = areaResult;       
        response.cargo    = cargoResult;       
        
        return Result.ok<SessionInfoLoginResponse>(response);
    }

    public async getUsersTable(query: any): Promise<Result<GetUsersTableResponse>> {
        const usuario = await UsuarioService.getAll();
        if (usuario.isFailure) return Result.fail(usuario.error);

        const roles = await RoleService.getAll();
        if (roles.isFailure) return Result.fail(roles.error);

        const usersList: UserTableItem[] = [];
        usuario
            .getValue()
            .filter((u) => u.id !== ID_SUPERADMIN)
            .forEach((user) => {
                const rol = roles.getValue().find((r) => r.id === user.props.roleId);
                usersList.push({
                    id     : user.id,
                    activo : user.props.activo,
                    nombre : user.getNombreCompletoCI(),
                    email  : user.props.email,
                    is_jefe: user.props.isJefe || false,
                    roles  : (rol?.props.nombre && toWordUpperFirstCase(rol?.props.nombre) || ""),
                    estado : user.props.estado,
                });
            });
        const response = findAndCountResult(usersList, query);
        return Result.ok<GetUsersTableResponse>(response);
    }

    public async getUserFormDataView(id_usuario: string): Promise<Result<GetUserFormDataResponse>> {
        const usuario = await UsuarioService.getById(id_usuario);
        if (usuario.isFailure) {
            return Result.fail<GetUserFormDataResponse>("Usuario no encontrado");
        }

        const props = usuario.getValue().props;
        const response = {
            id        : usuario.getValue().id,
            username  : props.username,
            password  : "******",
        };

        return Result.ok<GetUserFormDataResponse>({
            ...response,
            email           : props.email,
            role_id         : props.roleId,
            ci              : props.ci,
            nombre          : props.nombre,
            primer_apellido : props.primerApellido,
            segundo_apellido: props.segundoApellido,
            direccion       : props.direccion,
            telefono        : props.celular,
            genero          : props.genero,
            is_jefe         : props.isJefe ? "1" : "0",
        });
    }

    public async getAllUsuarios(): Promise<Result<{ rows: UsuarioOptionsFormModel[]; count: number }>> {
        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) return Result.fail("Falló al obtener la usuarios");
        const usuariosResult = usuarios.getValue().filter((u) => u.props.activo);
        const result: UsuarioOptionsFormModel[] = usuariosResult
            .filter((u) => u.id !== ID_SUPERADMIN)
            .map((item) => {
                return {
                    id    : item.id.toString(),
                    nombre: item.getNombreCompleto(),
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    public async getAllUsuarioArea(area_id: string): Promise<Result<any>> 
    {
        const persona = await PersonalService.getAll();
        if (persona.isFailure) return Result.fail("Falló al obtener la persona");
        const personaResult = persona.getValue().filter((a) => a.props.areaId==area_id).map((p) => p.props.usuarioId);

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) return Result.fail("Falló al obtener la usuarios");
        const usuariosResult = usuarios.getValue().filter((u) => personaResult.includes(u.id));        
        
        const result: UsuarioOptionsFormModel[] = usuariosResult
            .filter((u) => u.id !== ID_SUPERADMIN)
            .map((item) => {
                return {
                    id    : item.id.toString(),
                    nombre: item.getNombreCompleto(),
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
            
        return Result.ok({ rows: result, count: result.length });
    }    
    
    public async getAllUsuariosArea(authUser: AuthUser): Promise<Result<any>> 
    {
        const ID_USUARIO = authUser.uid;
        const personas = await PersonalService.getAll();
        if (personas.isFailure) return Result.fail("Falló al obtener la personas");
        const personasResult = personas.getValue();
        const personasR = personasResult.find((p) => p.props.usuarioId === ID_USUARIO);        
        if (!personasR) return Result.fail("Falló al obtener la personas");
      
        const ID_AREA = personasR?.props.areaId || "";

        const areas = await AreaService.getParentIds(ID_AREA);
        if (areas.isFailure) return Result.fail("Areas no encontrado");
        const areasResult = areas.getValue();
                
        const personasArray = personasResult.filter((a) => a.props.areaId && areasResult.includes(a.props.areaId));
        const personasJefeIdArray = personasArray.map((p) => p.props.usuarioId);
        
        const cargos = await CargoService.getAll(); 
        if (cargos.isFailure) throw Result.fail(String(cargos.error));
        const cargosResult = cargos.getValue();
        if (!cargosResult) return Result.fail("Error no existe cargo asignado."); 

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) return Result.fail("Falló al obtener la usuarios");
        const usuariosResult = usuarios.getValue().filter((u) => personasJefeIdArray.includes(u.id) && u.props.isJefe);
        
        const result: UsuarioOptionsFormModel[] = usuariosResult
            .filter((u) => u.id !== ID_SUPERADMIN)
            .map((item) => {
                const CargoID = personasArray.find((p) => p.props.usuarioId === item.id)?.props.cargoId;
                const nombreCargo = cargosResult.find((c) => c.id === CargoID)?.getCargoCompleto() || "";
                return {
                    id    : item.id.toString(),
                    nombre: item.getNombreCompleto() + ' -::- ' + nombreCargo,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
            
        return Result.ok({ rows: result, count: result.length });
    }


    public async getUsuarioArea(): Promise<Result<{ rows: UsuarioArea[]; count: number }>> {
        /*Listado de areas*/
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
        const areaResult = area.getValue();

        /*Listado de usuarios*/
        /*const usuario = await UsuarioService.getAll();
        if(usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
        const usuarioResult = area.getValue();*/

         /*Listado de usuarios*/
         const personal = await PersonalService.getAll();
         if(personal.isFailure) return Result.fail("Fallo al obtener el usuario");
         const personalResult = personal.getValue();

        /* listado general de la tabla area ordenados */
        const result: UsuarioArea[] = await Promise.all(
          personalResult.map(async (item) => {         
            const areaPersonalId = item.props.areaId;
            const areaUsuarioId = item.props.usuarioId;
            const usuarioAreaNombre = areaResult.find((c)=>c.id === areaPersonalId )?.props.nombre||"-";  
          //  if(areaUsuarioId != null && areaPersonalId != null) {
                return {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    id        : areaUsuarioId!, //area
                    nombre    : usuarioAreaNombre,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    caption   : areaPersonalId!, // personal
                  };
           // }             
          })
        );
      
      return Result.ok({ rows: result, count: result.length });
  } 
}

