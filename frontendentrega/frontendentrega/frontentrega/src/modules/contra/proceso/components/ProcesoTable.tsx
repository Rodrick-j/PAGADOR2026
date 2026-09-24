import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn, StatusColumn, ChangeStateColumn } from 'components/core/DataTable';
//@mui
import { Box, IconButton, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ProcesoModuleService } from 'modules/contra/proceso/ProcesoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_ESTADOS_K } from 'constants/enums';
import { ESTADO_J } from 'constants/colors';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { getAvatarURL } from 'utils';


export type ProcesoTableModel = {
    id    : string;
    entidad_convocante    : string;
    modalidad_descripcion : string;
    codigo_interno_entidad: string;
    cuce                  : string;
    objeto_contratacion   : string;
    hoja_ruta             : string;
    solicitante           : string;
    responsable           : string;
    juridica              : string;
    area                  : string;
    area2                 : string;
    area3                 : string;
    imagen                : string;
    imagen2               : string;
    imagen3               : string;

    fecha_registro        : Date;
    gestion               : string;
    estado                : string;
    estado_activo         : string;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    activo? : unknown;
};


export type ProcesoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ProcesoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ProcesoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const solicitanteConvocanteFilter: HeaderFilter = { type: 'text' };
const estadoConvocanteFilter: HeaderFilter = { type: 'select',options: [
    { value: 'ABIERTO', label: 'ABIERTO' },
    { value: 'CERRADO', label: 'CERRADO' },
    { value: 'SUSPENDIDO', label: 'SUSPENDIDO' },
] };
const cuceFilter: HeaderFilter = { type: 'text' };
const codigoFilter: HeaderFilter = { type: 'text' };
const hojaRutaFilter: HeaderFilter = { type: 'text' };
const nombreModalidadFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idProceso: string) => Promise<void>;
    onDetalleClick: (idProceso: string) => void;
    onEditClick: (idProceso: string) => Promise<void>;
};

export const ProcesoTableComponent = (props: Props, ref: React.Ref<ProcesoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onDetalleClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ProcesoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ProcesoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'responsable', label: 'Responsable Proceso(RPA - RPC)', align: 'left', render: renderColumnResponsable, width: 250 },
        { id: 'solicitante', label: 'Tecnico Encargado de Seguimiento(TES)', align: 'left', render: renderColumnSolicitante, filter: solicitanteConvocanteFilter, width: 250 },
        { id: 'juridica', label: 'Tecnico Juridica', align: 'left', render: renderColumnJuridica, width: 250 },
        { id: 'modalidad_descripcion', label: 'Modalidad de contratacion', align: 'left', filter: nombreModalidadFilter },
        { id: 'hoja_ruta', label: 'Hoja de Ruta', align: 'left', filter: hojaRutaFilter, width: 180 },
        { id: 'codigo_interno_entidad', label: 'Codigo Interno', align: 'left', filter: codigoFilter, width: 180 },
        { id: 'cuce', label: 'CUCE', align: 'left', filter: cuceFilter, width: 180 },
        { id: 'fecha_registro', label: 'Fecha Inicio de Proceso', align: 'left', width: 150, sort:true },
        { id: 'objeto_contratacion', label: 'Objeto de la Contratacion', align: 'left', width: 350 },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions
        },
        { id: 'activo', label: 'Cerrar Proceso', align: 'center', width: 120, render: renderColumnChange },
        { id: 'estado_activo', label: 'Estado Proceso', align: 'center', render:renderColumnStatus, width: 120, filter:estadoConvocanteFilter},

    ];

    const handleUpdateTable = (params: UpdateParams<ProcesoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ProcesoModuleService.getTableProceso(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ProcesoTableModel> = {
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
        });
    };

    useEffect(() => {
        tableRef.current?.refresh();
    }, [tableRef]);

    const tableRefHandler = () => ({
        refresh: () => {
            const newTableParams = {
                ...tableParams,
            };
            tableRef.current?.refresh(newTableParams);
        },
        getQueryParams: () => {
            const newParams = {
                ...tableParams,
                filters: {
                    ...tableParams.filters
                },
            };
            return newParams;
        }
    });

    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    function renderColumnSolicitante(tableModel: ProcesoTableModel): ReactElement {
        const imagen = tableModel.imagen;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.solicitante}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.solicitante}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.area}</Typography>
                </Box>
            </Box>
        );
    }


    function renderColumnJuridica(tableModel: ProcesoTableModel): ReactElement {
        const imagen = tableModel.imagen3;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.juridica}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.juridica}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.area3}</Typography>
                </Box>
            </Box>
        );
    }


    function renderColumnResponsable(tableModel: ProcesoTableModel): ReactElement {

        const imagen = tableModel.imagen2;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.responsable}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.responsable}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.area2}</Typography>
                </Box>
            </Box>
        );
    }

    function renderColumnActions(data: ProcesoTableModel): ReactElement {
        if(data.estado_activo==='CERRADO' ||data.estado_activo==='SUSPENDIDO' ) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
        return (

            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.cuce}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ProcesoModuleService.destroyProceso(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Proceso eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

   /* function renderColumnActive(data: ProcesoTableModel): ReactElement {

        return (
            <ActiveColumn
                active={data.estado_activo}
                onActiveChange={async (newValue: any) => {
                    return ProcesoModuleService.setActiveProceso(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }*/

 //proceso de aprobacion
 const [open2, setOpen2] = useState<boolean>(false);
 const [AproveId, setAproveId] = useState<string>('');
 const optionsVale = ENUM_ESTADOS_K.map((m) => m.value);
 function renderColumnChange(data: ProcesoTableModel): ReactElement {

     if(data.estado_activo==='SUSPENDIDO' || data.estado_activo==='CERRADO') return <>{'-'}</>;
     return (
         <>
               <ConfirmDialog
                 title={'Confirmar SUSPENCION'}
                 message={'Esta seguro de SUSPENDER el proceso? Una vez SUSPENDIDO se ya no se podran recuperar los datos'}
                 open={open2}
                 onAccept={async () => {

                     return ProcesoModuleService.setAbiertoProceso(AproveId,'SUSPENDIDO').then((result) => {
                         if (!result.success) return notify.error(result.msg);
                         notify.success('Se actualizo exitosamente');
                         setOpen2(false);
                         tableRef.current?.refresh();
                     });
                 }}
                 onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
             />
            <ChangeStateColumn
                 data={data.estado_activo}
                 options={optionsVale}
                 onChange={async (newValue: any) => {
                     if(String(newValue).length === "SUSPENDIDO".length){
                         setOpen2(true);
                         setAproveId(data.id);
                     }else{
                        ProcesoModuleService.setAbiertoProceso(data.id, newValue).then((result) => {
                             if (!result.success) return notify.error(result.msg);
                             notify.success('Se actualizo exitosamente');
                             tableRef.current?.refresh();});
                     }
                 }}
             />
         </>
     );
 }

 //cambio de color estado
 function renderColumnStatus(data: ProcesoTableModel): ReactElement {
    const estado = data.estado_activo;
    const color = 'white';
    const background = ESTADO_J[estado];
    const texto = estado;
    return <StatusColumn status={texto} color={color} background={background} />;
}


    /*function renderColumnStatus(data: ProcesoTableModel): ReactElement {
        const estado = data.estado_activo?'ABIERTO':'CERRADO';
        const color = 'white';
        const background = data.estado_activo? ESTADO_A[0] : ESTADO_A[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }*/

    function renderColumnOptions(data: ProcesoTableModel): ReactElement {
        return (
            <>
                <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                    <ListAltIcon />
                </IconButton>
            </>
        );
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const ProcesoTable = forwardRef(ProcesoTableComponent);
