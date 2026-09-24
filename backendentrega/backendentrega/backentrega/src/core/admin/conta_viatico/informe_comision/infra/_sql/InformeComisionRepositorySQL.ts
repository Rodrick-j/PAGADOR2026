import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { InformeComisionEntity } from "../../InformeComisionEntity";
import { IInformeComisionRepository } from "../IInformeComisionRepository";
import { Result } from "../../../../../../base/types/Result";
import { InformeComisionSQLModelData } from "./InformeComisionSQLModel";

export class InformeComisionRepositorySQL extends BaseSQLRepository<InformeComisionEntity, InformeComisionSQLModelData> implements IInformeComisionRepository {
    fromSQLModelData(data: InformeComisionSQLModelData, id: string): Result<InformeComisionEntity> {
        return InformeComisionEntity.create(
            {
                ida                   :data.ida,
                retorno               :data.retorno,
                objetoViaje           :data.objeto_viaje,
                desarrollo            :data.desarrollo,
                conclusion            :data.conclusion,
                imagenUno             :data.imagen_uno,
                descripcionUno        :data.descripcion_uno,
                imagenDos             :data.imagen_dos,
                descripcionDos        :data.descripcion_dos,
                imagenTres            :data.imagen_tres,
                descripcionTres       :data.descripcion_tres,
                vehiculoId            :data.fid_vehiculo,
                vehiculoPublicoId     :data.fid_vehiculo_publico,
                memorandumId          :data.fid_memorandum,
            },
            id,
        );
    }
    toSQLModelData(entity: InformeComisionEntity): InformeComisionSQLModelData {
        return {
            ida                   :entity.props.ida,
            retorno               :entity.props.retorno,
            objeto_viaje          :entity.props.objetoViaje,
            desarrollo            :entity.props.desarrollo,
            conclusion            :entity.props.conclusion,
            imagen_uno            :entity.props.imagenUno,
            descripcion_uno       :entity.props.descripcionUno,
            imagen_dos            :entity.props.imagenDos,
            descripcion_dos       :entity.props.descripcionDos,
            imagen_tres           :entity.props.imagenTres,
            descripcion_tres      :entity.props.descripcionTres,
            fid_vehiculo          :entity.props.vehiculoId,
            fid_vehiculo_publico  :entity.props.vehiculoPublicoId,
            fid_memorandum        :entity.props. memorandumId,
        };
    }
}
