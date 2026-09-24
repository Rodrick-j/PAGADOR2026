import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type InformeGeneralProps = {
    reciboPagoViatico     : FileItem[];
    memorandum            : FileItem[];
    informeComision       : FileItem[];
    facturasViaje         : FileItem[];
    actaVisitaReunion     : FileItem[];
    reporteFotografico    : FileItem[];
    certificadoAsistencia : FileItem[];
    boletaDeposito        : FileItem[];
    descargoId            : string | null;
};


export class InformeGeneralEntity extends Entity<InformeGeneralProps>{
    public static create(props : InformeGeneralProps, id?: string): Result<InformeGeneralEntity>{
        return Result.ok<InformeGeneralEntity>(new InformeGeneralEntity(props, id));
    }
}



