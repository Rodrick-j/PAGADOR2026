import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { CuentaEntity } from "../../CuentaEntity";
import { ICuentaRepository } from "../ICuentaRepository";
import { Result } from "../../../../../../base/types/Result";
import { CuentaSQLModelData } from "./CuentaSQLModel";

export class CuentaRepositorySQL extends BaseSQLRepository<CuentaEntity, CuentaSQLModelData> implements ICuentaRepository {
    fromSQLModelData(data: CuentaSQLModelData, id: string): Result<CuentaEntity> {
        return CuentaEntity.create(
            {
                ci                     : data.ci,
                tipoCuenta             : data.tipo_cuenta,
                nombreDeudor           : data.nombre_deudor,
                gestionGeneracionDeuda : data.gestion_generacion_deuda,
                documentacionRespaldo  : data.documentacion_respaldo,
                direccionDomicilio     : data.direccion_domicilio,
                telefonoCelular        : data.telefono_celular,
                confirmacion           : data.confirmacion,
                descripcionConfirmacion: data.descripcion_confirmacion,
                incrementoDeuda        : data.incremento_deuda,
                motivoDeuda            : data.motivo_deuda,
                montoIncrementoDeuda   : data.monto_incremento_deuda,
                depositosRealizados    : data.depositos_realizados,
                observacion            : data.observacion,
                saldo                  : data.saldo,
                adjuntos               : data.adjuntos,
                estado                 : data.estado,
                descripcionDeuda       : data.descripcion_deuda,
                estadoProceso          : data.estado_proceso,
                detalleGestionDeuda     : data.detalle_gestion_deuda,
            },
            id,
        );
    }
    toSQLModelData(entity: CuentaEntity): CuentaSQLModelData {
        return {
            ci                      : entity.props.ci,
            tipo_cuenta             : entity.props.tipoCuenta,
            nombre_deudor           : entity.props.nombreDeudor,
            gestion_generacion_deuda: entity.props.gestionGeneracionDeuda,
            documentacion_respaldo  : entity.props.documentacionRespaldo,
            direccion_domicilio     : entity.props.direccionDomicilio,
            telefono_celular        : entity.props.telefonoCelular,
            confirmacion            : entity.props.confirmacion,
            descripcion_confirmacion: entity.props.descripcionConfirmacion,
            incremento_deuda        : entity.props.incrementoDeuda,
            motivo_deuda            : entity.props.motivoDeuda,
            monto_incremento_deuda  : entity.props.montoIncrementoDeuda,
            depositos_realizados    : entity.props.depositosRealizados,
            observacion             : entity.props.observacion,
            saldo                   : entity.props.saldo,
            adjuntos                : entity.props.adjuntos,
            estado                  : entity.props.estado,
            descripcion_deuda       : entity.props.descripcionDeuda,
            estado_proceso          : entity.props.estadoProceso,
            detalle_gestion_deuda    : entity.props.detalleGestionDeuda,
        };
    }
}
