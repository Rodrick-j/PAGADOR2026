import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type SeguimientoProps = {
    fecha      : Date;
    descripcion: string;
    observacion: string;
    dias       : number;
    estado     : boolean;
    enviado?   : boolean;
    adjuntos   : FileItem[]; 
    cuentaId   : string;
};

export class SeguimientoEntity extends Entity<SeguimientoProps> {
    public static create(props: SeguimientoProps, id?: string): Result<SeguimientoEntity> {
        return Result.ok<SeguimientoEntity>(new SeguimientoEntity(props, id));
    }
}
