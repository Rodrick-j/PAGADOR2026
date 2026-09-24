import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ValeEntity } from "../../ValeEntity";
import { IValeRepository } from "../IValeRepository";
import { Result } from "../../../../../../base/types/Result";
import { ValeSQLModelData } from "./ValeSQLModel";

export class ValeRepositorySQL extends BaseSQLRepository<ValeEntity, ValeSQLModelData> implements IValeRepository {
    fromSQLModelData(data: ValeSQLModelData, id: string): Result<ValeEntity> {
        return ValeEntity.create(
            {
                codVale       : data.cod_vale,
                fechaEmision  : data.fecha_emision,
                fechaValidez  : data.fecha_validez,
                litros        : data.litros,
                concepto      : data.concepto,
                distancia     : data.distancia,
                precioUnitario: data.precio_unitario,
                precioTotal   : data.precio_total,
                observaciones : data.observaciones,
                destino       : data.destino,
                otroVehiculo  : data.otro_vehiculo,
                destinos      : data.destinos,
                estado        : data.estado,
                usuarioId     : data.fid_usuario,
                vehiculoId    : data.fid_vehiculo,
                asignacionId  : data.fid_asignacion,
                gestion       : data.gestion || null,
                numeroRecibo  : data.numero_recibo,
                litrosReales  : data.litros_reales,
                precioReal    : data.precio_real,
                numeroFactura : data.numero_factura,
                fechaFactura  : data.fecha_factura,
                estadoEjecutado: data.estado_ejecutado,  
                preAsignacion  : data.pre_asignacion,
                
            },
            id,
        );
    }
    toSQLModelData(entity: ValeEntity): ValeSQLModelData {
        return {
            cod_vale       : entity.props.codVale,
            fecha_emision  : entity.props.fechaEmision,
            fecha_validez  : entity.props.fechaValidez,
            litros         : entity.props.litros,
            concepto       : entity.props.concepto,
            distancia      : entity.props.distancia,
            precio_unitario: entity.props.precioUnitario,
            precio_total   : entity.props.precioTotal,
            observaciones  : entity.props.observaciones,
            destino        : entity.props.destino,
            otro_vehiculo  : entity.props.otroVehiculo,
            destinos       : entity.props.destinos,
            estado         : entity.props.estado || "PENDIENTE",
            fid_usuario    : entity.props.usuarioId,
            fid_vehiculo   : entity.props.vehiculoId,
            fid_asignacion : entity.props.asignacionId,
            gestion        : entity.props.gestion,
            numero_recibo  : entity.props.numeroRecibo,
            litros_reales  : entity.props.litrosReales,
            precio_real    : entity.props.precioReal,
            numero_factura : entity.props.numeroFactura,
            fecha_factura  : entity.props.fechaFactura,
            estado_ejecutado : entity.props.estadoEjecutado,  
            pre_asignacion   : entity.props.preAsignacion,
        };
    }
}
