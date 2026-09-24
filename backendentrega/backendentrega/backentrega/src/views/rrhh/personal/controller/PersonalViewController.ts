import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import PersonalView from "..";
import { PersonalProps } from "../../../../core/rrhh/personal/PersonalEntity";
import PersonalService from "../../../../core/rrhh/personal";
import { AuthUser } from "../../../../base/types/AuthUser";
import { PersonalFormDataResponse } from "../PersonalView";

export class PersonalViewController extends BaseHttpController {
    public async getTablePersonal(req: Request, res: Response): Promise<any> {
        const personals = await PersonalView.getTablePersonal(req.query);
        if (personals.isFailure) return this.fail(res, "Falló al obtener la tabla de personals");
        return this.ok<any>(res, personals.getValue());
    }

    public async getPersonalFormData(req: Request, res: Response): Promise<any> {
        const formData = await PersonalView.getPersonalFormDataView(req.params.personal_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<PersonalFormDataResponse>(res, formData.getValue());
    }

    public async getAllPersonal(req: Request, res: Response): Promise<any> {
        const result = await PersonalView.getAllPersonal();
        return this.ok<any>(res, result.getValue());
    }

    public async getAllPersonalCliente(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const result = await PersonalView.getAllPersonalCliente(AUTH_USER);
        return this.ok<any>(res, result.getValue());
    }

    public async getAllPersonalCI(req: Request, res: Response): Promise<any> {
        const result = await PersonalView.getAllPersonalCI();
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdatePersonal(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const ID_PERSONAL = req.body.id;
        
        const CI = String(data.ci).trim().replace(/\s+/g, '');
        const personalResult = await PersonalService.getAll();
        if (personalResult.isFailure) return this.ok<any>(res, personalResult.getValue());
        const existePersonalDB = personalResult.getValue().find((u) => u.props.ci === CI);
        const existe = !!existePersonalDB;
        if (existe && !ID_PERSONAL) return this.fail(res, "Los datos proporsionados ya estan registrados.");

        const props: PersonalProps = {
            nombres             : data.nombres,
            apellidoPaterno     : data.apellido_paterno,
            apellidoMaterno     : data.apellido_materno,
            apellidoCasada      : data.apellido_casada,
            ci                  : data.ci,
            expedicion          : data.expedicion,
            sexo                : data.sexo,
            fechaNacimiento     : new Date(data.fecha_nacimiento),
            fechaIngreso        : new Date(data.fecha_ingreso),
            estadoCivil         : data.estado_civil,
            profesion           : data.profesion,
            telefono            : data.telefono,
            direccion           : data.direccion,
            activo              : data.activo,
            afp                 : data.afp,
            rentista            : data.rentista,
            fechaPresentacionCas: data.fecha_presentacion_cas,
            anhosAntiguedadGador: data.anhos_antiguedad_gador,
            anhosAntiguedadCas  : data.anhos_antiguedad_cas,
            mesesAntiguedadCas  : data.meses_antiguedad_cas,
            diasAntiguedadCas   : data.dias_antiguedad_cas,
            usuarioId           : data.usuario_id,
            cargoId             : data.cargo_id,
            areaId              : data.area_id,
        };
        
        let result = null;
        
        if (ID_PERSONAL) {
            result = await PersonalService.update(ID_PERSONAL, props);
            if (result.isFailure) return this.fail(res, "Falló al modificar la personal");
            return this.ok<any>(res, result);
        }
        result = await PersonalService.create(props, ID_PERSONAL);
        if (result.isFailure) return this.fail(res, "Falló al crear la personal");
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const personalId = req.params.personal_id;
        const activo = Boolean(req.body.activo);

        const result = await PersonalService.update(personalId, { activo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyPersonal(req: Request, res: Response): Promise<any> {
        const ID_PERSONAL = req.params.personal_id;
        const result = await PersonalService.eliminaPersonal(ID_PERSONAL);
        if (result.isFailure) {
            return this.fail(res, "Error al eliminar el personal");
        }
        return this.ok<any>(res);
    }
}
