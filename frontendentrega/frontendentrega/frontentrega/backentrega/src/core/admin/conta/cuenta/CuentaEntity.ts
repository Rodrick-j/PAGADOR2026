import { FileItem } from "../../../../base/types/FileItem";
import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type CuentaProps = {
    ci                     : string;
    tipoCuenta             : string;
    nombreDeudor           : string;
    gestionGeneracionDeuda : string;
    documentacionRespaldo  : string;
    direccionDomicilio     : string;
    telefonoCelular        : string;
    confirmacion           : string;
    descripcionConfirmacion: string;
    motivoDeuda            : string[];
    incrementoDeuda        : string;
    montoIncrementoDeuda   : number;
    depositosRealizados    : string;
    observacion            : string;
    saldo                  : number | string;
    adjuntos               : FileItem[]; 
    estado                 : boolean;
    //aumentamos 2 campos 
    descripcionDeuda       : string;
    estadoProceso          : string;
    detalleGestionDeuda    : string;
};

export class CuentaEntity extends Entity<CuentaProps> {
    public static create(props: CuentaProps, id?: string): Result<CuentaEntity> {
        return Result.ok<CuentaEntity>(new CuentaEntity(props, id));
    }
}
