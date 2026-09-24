import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ProcesoProps = {    
    objetoContratacion  : string;
    modalidadDescripcion: string;
    modalidadSigla      : string;
    codigoInternoEntidad: string;
    cuce                : string;
    fechaRegistro       : Date;
    gestion             : string;
    hojaRuta            : string;
    estado              : string;
    paso?               : string | null;
    usuarioId           : string;
    usuarioSolicitanteId: string | null;
    usuarioSolicitante2Id: string | null;
    usuarioSolicitante3Id: string | null;
    estadoActivo         :string | null;
    areaId              : string | null;
};

export class ProcesoEntity extends Entity<ProcesoProps> {
    public static create(props: ProcesoProps, id?: string): Result<ProcesoEntity> {
        return Result.ok<ProcesoEntity>(new ProcesoEntity(props, id));
    }
}
