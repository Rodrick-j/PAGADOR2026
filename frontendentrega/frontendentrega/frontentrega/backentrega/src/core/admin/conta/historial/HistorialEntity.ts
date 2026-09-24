import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type HistorialProps = {
    fecha      : Date;
    descripcion: string;
    debe       : number;
    haber      : number;
    saldo      : number;    
    estado     : boolean;
    adjuntos   : FileItem[]; 
    deudasId   : string[];
    cuentaId   : string;
};

export class HistorialEntity extends Entity<HistorialProps> {
    public static create(props: HistorialProps, id?: string): Result<HistorialEntity> {
        return Result.ok<HistorialEntity>(new HistorialEntity(props, id));
    }
}
