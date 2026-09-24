import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type VehiculoPublicoProps ={
    razonSocial          : string;
    numBoleto            : number;
    placa                : string;
    tipoVehiculo         : string;
    precioBoleto         : number;
      
};

export class VehiculoPublicoEntity extends Entity<VehiculoPublicoProps>{
    public static create(props : VehiculoPublicoProps, id? : string):Result<VehiculoPublicoEntity>{
        return Result.ok<VehiculoPublicoEntity>(new VehiculoPublicoEntity(props, id));
    }
}
