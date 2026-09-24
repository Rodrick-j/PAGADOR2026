import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type DocumentoAdjunto = string | FileItem;

export type DocumentoProps = {
    nro         : number;
    tipo        : string;
    gestion     : string;
    nrofolio    : string;
    fecha       : Date;
    estado      : string;
    permiso     : string;    
    descripcion?: string | null;
    docAdjunto? : string | null;
    hojasRuta?  : string | null;
    grupoGasto? : string | null;
    ubicacion?  : string | null;
    monto       : number;
    adjuntos    : DocumentoAdjunto[];
};

export class DocumentoEntity extends Entity<DocumentoProps> {
    public static create(props: DocumentoProps, id?: string): Result<DocumentoEntity> {
        return Result.ok<DocumentoEntity>(new DocumentoEntity(props, id));
    }
}
