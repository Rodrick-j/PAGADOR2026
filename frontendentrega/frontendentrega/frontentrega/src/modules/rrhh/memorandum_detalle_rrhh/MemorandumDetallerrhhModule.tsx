import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui

// components

import { useNotify } from 'services/notify';
import {  MemorandumDetalleDestinorrhhFormDialog, MemorandumDetalleDestinorrhhFormModel } from './components/MemorandumDetallerrhhFormDialog';
import {  MemorandumDetallerrhhTable, MemorandumDetalleTableRefProps } from './components/MemorandumDetallerrhhTable';
import {useParams} from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';
import { MemorandumrrhhFormModel } from '../memorandum_rrhh/components/MemorandumrrhhFormDialog';
import { MemorandumrrhhModuleService } from '../memorandum_rrhh';
//import DetalleDestinoDialog from 'modules/viatico/detalle_destino/components/DetalleDestinoDialog';
import { MemorandumDetallerrhhModuleService } from './MemorandumDetallerrhhModuleService';

export const MemorandumDetallerrhhModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const ID_MEMORANDUM = params.id || '';
    const [memorandumData, setMemorandumData] = useState<MemorandumrrhhFormModel>();
    const isMounted = useIsMounted();


    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDetalleDestinoForm, setOpenDetalleDestinoForm] = useState(false);
    const [formModel, setFormModel] = useState<MemorandumDetalleDestinorrhhFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await MemorandumDetallerrhhModuleService.getDetalleDestinoFormData(id_area);
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
        const actividadFormResponse = await MemorandumDetallerrhhModuleService.getDetalleDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const memorandumDetalleFormResponse = await MemorandumrrhhModuleService.getMemorandumFormData(ID_MEMORANDUM);
            if (!memorandumDetalleFormResponse.success) return notify.error(memorandumDetalleFormResponse.msg);
            const newFormModel: MemorandumrrhhFormModel | null = memorandumDetalleFormResponse.data || null;
            if (isMounted()) {
                if (newFormModel !== null)
                    setMemorandumData({
                                    //Tabla original de meorandum
                                       cod_depart_memo        : newFormModel.cod_depart_memo,
                                        autorizado_por         : newFormModel.autorizado_por,
                                        tipo_memorandum       : newFormModel.tipo_memorandum,
                                    // cargo_jefe_unidad      : string;
                                        fecha_memo_registro    : newFormModel.fecha_memo_registro,
                                        tipo_comision_idp      : newFormModel.tipo_comision_idp,
                                        fecha_inicio_viaje     : newFormModel.fecha_inicio_viaje,
                                        fecha_fin_viaje        : newFormModel.fecha_fin_viaje,
                                        cantidad_dias          : newFormModel.cantidad_dias,
                                        tipo_memo_repo         : newFormModel.tipo_memo_repo,
                                        tipo_transporte        : newFormModel.tipo_transporte,
                                        observacion            : newFormModel.observacion,
                                        estado_memorandum      : newFormModel.estado_memorandum,
                                        notificacion_memo      : newFormModel.notificacion_memo,
                                      //  apertura_viatico_id   : newFormModel.apertura_viatico_id,
                                       // apertura_pasaje_id   : newFormModel.apertura_pasaje_id,
                                        usuario_id            : newFormModel.usuario_id,
                                        vehiculo_id           : newFormModel.vehiculo_id,
                                        cargo_id              : newFormModel.cargo_id,

                                        nombre_usuario : newFormModel.nombre_usuario,
                                        ci: newFormModel.ci,
                                        cargo_usuario : newFormModel.cargo_usuario,
                                        nume_celular:newFormModel.nume_celular,
                                        dias_habiles:newFormModel.dias_habiles,
                                        modificacion       : newFormModel.modificacion,
                                        obs_modificacion   : newFormModel.obs_modificacion,
                                        fecha_cambio       : newFormModel.fecha_cambio,
                                        estado_modificacion: newFormModel.estado_modificacion,

                                    });

            }
        };
        if(ID_MEMORANDUM) fetchData();

    }, [ID_MEMORANDUM]);


    const tableRef = useRef<MemorandumDetalleTableRefProps>(null);

    return (
        <>
            <MemorandumDetalleDestinorrhhFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
                memorandumId={ID_MEMORANDUM}

            />
         {/* <DetalleDestinoDialog
                open={openDetalleDestinoForm}
                onComplete={() => {
                    setOpenDetalleDestinoForm(false);
                }}
                formModel={formModel}
            />*/}
            <MemorandumDetallerrhhTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                memorandumId={ID_MEMORANDUM}
                data={memorandumData || null}


            />

        </>
    );
};
