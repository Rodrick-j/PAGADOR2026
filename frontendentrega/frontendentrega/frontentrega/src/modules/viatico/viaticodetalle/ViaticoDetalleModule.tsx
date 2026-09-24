import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui

// components
import { useNotify } from 'services/notify';
import { DetalleDestinoModuleService } from '../detalle_destino';
import DetalleDestinoDialog from '../detalle_destino/components/DetalleDestinoDialog';
import { useParams } from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';
import { ViaticoFormModel } from '../viatico/components/ViaticoFormDialog';
import { ViaticoDetalleDestinoFormDialog, ViaticoDetalleDestinoFormModel } from './components/ViaticoDetalleFormDialog';
import { ViaticoModuleService } from '../viatico/ViaticoModuleService';
import { ViaticoDetalleDestinoTable, ViaticoDetalleDestinoTableRefProps } from './components/ViaticoDetalleDestino';


export const ViaticoDetalleModule = (): ReactElement => {
    const params = useParams<string>();
    const notify = useNotify();
   // const params = useParams();
    const ID_VIATICO = params.id || '';
    const ID_MEMORANDUM = params.memoId || '';
    const [viaticoData, setViaticoData] = useState<ViaticoFormModel>();
    const isMounted = useIsMounted();
  
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDetalleDestinoForm, setOpenDetalleDestinoForm] = useState(false);
    const [formModel, setFormModel] = useState<ViaticoDetalleDestinoFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await DetalleDestinoModuleService.getDetalleDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenDetalleDestinoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await DetalleDestinoModuleService.getDetalleDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const viaticoDetalleFormResponse = await ViaticoModuleService.getViaticoFormData(ID_VIATICO);
            if (!viaticoDetalleFormResponse.success) return notify.error(viaticoDetalleFormResponse.msg);
            const newFormModel: ViaticoFormModel | null = viaticoDetalleFormResponse.data || null;
            if (isMounted()) {
                if (newFormModel !== null)
                    setViaticoData({

                        nume_recibo             : newFormModel.nume_recibo,
                        fecha_pago_viatico      : newFormModel.fecha_pago_viatico,
                        suma_pasaje_ida         : newFormModel.suma_pasaje_ida,
                        suma_pasaje_retorno     : newFormModel.suma_pasaje_retorno,
                        tipo_pasaje_gd          : newFormModel.tipo_pasaje_gd,
                        total_pasajes           : newFormModel.total_pasajes,
                        total_viatico           : newFormModel.total_viatico,
                        liquido_pagable         : newFormModel.liquido_pagable,
                        estado_pago             : newFormModel.estado_pago,
                        estado_recibo           : newFormModel.estado_recibo,
                        fecha_anulacion         : newFormModel.fecha_anulacion,
                        notificacion_viatico    : newFormModel.notificacion_viatico,
                        memorandum_id          : newFormModel.memorandum_id,
                        escala_id              : newFormModel.escala_id,
												  
                        //campos para MOSTRAR     newFormModel.
												  
                        usuario_nombre          :newFormModel.usuario_nombre,
                        cod_depart_memo         :newFormModel.cod_depart_memo,
                        ci                      :newFormModel.ci,
                        cargo_usuario           :newFormModel.cargo_usuario,
                        fecha_memo_registro     :newFormModel.fecha_memo_registro,
                        tipo_comision_idp       :newFormModel.tipo_comision_idp,
                        tipo_comision_idp_escala :newFormModel.tipo_comision_idp_escala,
                        fecha_inicio_viaje      :newFormModel.fecha_inicio_viaje,
                        fecha_fin_viaje         :newFormModel.fecha_fin_viaje,
                        categoria_usuario       :newFormModel.categoria_usuario,
                        viaticos_por_dia        :newFormModel.viaticos_por_dia,
                        cantidad_dias           :newFormModel.cantidad_dias,                    
                                           
                                       
                     });

            }
        };
        if(ID_VIATICO) fetchData();

    }, [ID_VIATICO]);


    const tableRef = useRef<ViaticoDetalleDestinoTableRefProps>(null);

    return (
        <>
            <ViaticoDetalleDestinoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
                memorandumId={ID_MEMORANDUM}
                viaticoId={ID_VIATICO}
                
            />
          <DetalleDestinoDialog
                open={openDetalleDestinoForm}
                onComplete={() => {
                    setOpenDetalleDestinoForm(false);
                }}
                formModel={formModel}
            />
            <ViaticoDetalleDestinoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                memorandumId={ID_MEMORANDUM} 
                viaticoId={ID_VIATICO}
                data={viaticoData || null}
               
               
            />
          
        </>
    );
};
