import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";
import { FileItem } from "../../../../base/types/FileItem";

export type ActaProps = {
    codActa           : string;
    fechaDevolucion   : Date | null;
    fechaRegistro     : Date;
    dias              : number;
    tipo              : string;
    descripcion       : string;
    estado            : boolean;
    externo           : boolean;
    descripcionExterno: string;
    documentosId      : string[];
    adjuntos          : FileItem[];
    areaId            : string;
    personalId        : string;
};

export class ActaEntity extends Entity<ActaProps> {
    public static create(props: ActaProps, id?: string): Result<ActaEntity> {
        return Result.ok<ActaEntity>(new ActaEntity(props, id));
    }
}
