import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type MemorandumProps ={
    codDepartMemo         : string;
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
    aperturaViaticoId    : string | null;
    aperturaPasajeId     : string | null;
    usuarioId            : string | null;

    modificacion         : boolean; 
    obsModificacion      : string | null;
    fechaCambio          : string;
    estadoModificacion   : string;

    justificacion        : string;  //este campo se utililza para la justificacion de anulacion o rechazo

    aprobacionRRHHconta  : string[];
    tiempoAprobacionUsuario : string[];
};

export class MemorandumEntity extends Entity<MemorandumProps>{
    public static create(props : MemorandumProps, id? : string):Result<MemorandumEntity>{
        return Result.ok<MemorandumEntity>(new MemorandumEntity(props, id));
    }
}
