import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export type MemorandumrrhhProps ={
    codDepartMemo         : string;
    tipoMemorandum        : string;
    autorizadoPor        : string[];
   // cargoJefeUnidad      : string;
    fechaMemoRegistro    : Date;
    tipoComisionIDP      : string;
    fechaInicioViaje     : Date;
    fechaFinViaje        : Date;
    cantidadDias         : number;
    tipoMemoRepo         : string;
    tipoTransporte       : string;
    observacion          : string;
    estadoMemorandum     : string;
    diasHabiles          : string;
    notificacionMemo     : string;
    usuarioId            : string | null;
    modificacion         : boolean; 
    obsModificacion      : string | null;
    fechaCambio          : string;
    estadoModificacion   : string;
};

export class MemorandumrrhhEntity extends Entity<MemorandumrrhhProps>{
    public static create(props : MemorandumrrhhProps, id? : string):Result<MemorandumrrhhEntity>{
        return Result.ok<MemorandumrrhhEntity>(new MemorandumrrhhEntity(props, id));
    }
}
