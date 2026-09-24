import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  InformeComisionService  from "../../../../core/admin/conta_viatico/informe_comision";

type InformeComisionTableModel = {
    
    id                    :string;
    ida                   :boolean;
    retorno               :boolean;
    objeto_viaje          :string;
    desarrollo            :string;
    conclusion            :string;
    imagen_uno            :string;
    descripcion_uno       :string;
    imagen_dos            :string;
    descripcion_dos       :string;
    imagen_tres           :string;
    descripcion_tres      :string;
    vehiculo_id           :string;
    vehiculo_publico_id   :string;
    memorandum_id         :string; 
};

export type GetInformeComisionsTableResponse = {
    rows: InformeComisionTableModel[];
    count: number;
};

export type InformeComisionFormDataResponse = {
    id                    :string;
    ida                   :boolean;
    retorno               :boolean;
    objeto_viaje          :string;
    desarrollo            :string;
    conclusion            :string;
    imagen_uno            :string;
    descripcion_uno       :string;
    imagen_dos            :string;
    descripcion_dos       :string;
    imagen_tres           :string;
    descripcion_tres      :string;
    vehiculo_id           :string;
    vehiculo_publico_id   :string;
    memorandum_id         :string; 
};

/*export type InformeComisionsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};*/

export class InformeComisionView {
    public async getInformeComisionsTable(query: any): Promise<Result<{ rows: InformeComisionTableModel[] }>> {
            const informeComision = await InformeComisionService.getAll();
            if (informeComision.isFailure) return Result.fail("Falló al obtener la InformeComision");
            const InformeComisionResult = informeComision.getValue();
                               
            const result: InformeComisionTableModel[] = InformeComisionResult.map((item) => {
              
                return {
                    id                    :String(item.id), 
                    ida                   :item.props.ida,
                    retorno               :item.props.retorno,
                    objeto_viaje          :item.props.objetoViaje,
                    desarrollo            :item.props.desarrollo,
                    conclusion            :item.props.conclusion,
                    imagen_uno            :`${JSON.stringify(item.props.imagenUno)}`,
                    descripcion_uno       :item.props.descripcionUno,
                    imagen_dos            :`${JSON.stringify(item.props.imagenDos)}`,
                    descripcion_dos       :item.props.descripcionDos,
                    imagen_tres           :`${JSON.stringify(item.props.imagenTres)}`,
                    descripcion_tres      :item.props.descripcionTres,
                    vehiculo_id           :item.props.vehiculoId,
                    vehiculo_publico_id   :item.props.vehiculoPublicoId,
                    memorandum_id         :item.props.memorandumId,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getInformeComisionFormDataView(id_informe_comision: string): Promise<Result<InformeComisionFormDataResponse>> {
        const informeComision = await InformeComisionService.getById(id_informe_comision);
        if (informeComision.isFailure) return Result.fail<InformeComisionFormDataResponse>("InformeComision no encontrado");
        
        const props = informeComision.getValue().props;

        const result: InformeComisionFormDataResponse = {
            id                    :informeComision.getValue().id,
            ida                   :props.ida,
            retorno               :props.retorno,
            objeto_viaje          :props.objetoViaje,
            desarrollo            :props.desarrollo,
            conclusion            :props.conclusion,
            imagen_uno            :props.imagenUno ? JSON.stringify(props.imagenUno) : '[]',
            descripcion_uno       :props.descripcionUno,
            imagen_dos            :props.imagenDos ? JSON.stringify(props.imagenDos) : '[]',
            descripcion_dos       :props.descripcionDos,
            imagen_tres           :props.imagenTres ? JSON.stringify(props.imagenTres) : '[]',
            descripcion_tres      :props.descripcionTres,
            vehiculo_id           :props.vehiculoId,
            vehiculo_publico_id   :props.vehiculoPublicoId,
            memorandum_id         :props.memorandumId,
        };

        return Result.ok(result);
    }
}