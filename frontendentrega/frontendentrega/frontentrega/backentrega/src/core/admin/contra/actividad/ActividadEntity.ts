import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ActividadProps = {
    titulo                 : string;
    descripcion            : string;
    paso                   : number;
    tiempo                 : string;
    notificacion           : boolean;
    notificacionSolicitante?: boolean ;
    observacion            : string;
    observacion2?          : string;
    fecha                  : Date;
    fechaLimite            : Date;
    fechaEnvio             : Date | null;
    estado                 : string;
    usuariosId             : string[];
    procesoId              : string;   
};

export class ActividadEntity extends Entity<ActividadProps> {
    public static create(props: ActividadProps, id?: string): Result<ActividadEntity> {
        return Result.ok<ActividadEntity>(new ActividadEntity(props, id));
    }
}
