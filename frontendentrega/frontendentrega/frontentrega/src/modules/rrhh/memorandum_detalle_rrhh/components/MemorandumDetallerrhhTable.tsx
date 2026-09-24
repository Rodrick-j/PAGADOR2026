import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
//import { Box } from '@mui/material';
import { Box, Dialog, DialogContent, Paper, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model

//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_O } from 'constants/colors';
//import { MemorandumFormModel } from 'modules/viatico/memorandum/components/MemorandumFormDialog';
import { getAvatarURL } from 'utils';
import { MemorandumrrhhFormModel } from 'modules/rrhh/memorandum_rrhh/components/MemorandumrrhhFormDialog';
import { MemorandumDetallerrhhModuleService } from '../MemorandumDetallerrhhModuleService';

export type MemorandumDetallerrhhTableModel = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;   
    estado                    : string;
    modificacion?              : boolean;
    observacion?               : string;
    estado_observacion?        : string;
    memorandum_rrhh_id?            : string;
    viatico_id?               : string;
    destino_id?               : string;
    destino_id2?               : string;
    activo                   : boolean;
   // aumentamos campos vehiculo
     vehiculo_id? : string;
     num_placa? : string;
     cod_memorandum? :string;
     dia_semana? : string;
     hay_viaje? : string;
    // para las columnas especiales
    actions: unknown;
};


export type MemorandumDetalleTableRefProps = {
    refresh: (updateParams?: UpdateParams<MemorandumDetallerrhhTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<MemorandumDetallerrhhTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const FORMAT = 'dd/MM/yyyy';


const codigoFilter: HeaderFilter = { type: 'text' };
const destinoFilter: HeaderFilter = { type: 'text' };


type Props = {
    memorandumId  : string;
    onAddClick: () => void;
    onViewClick: (idDetalleDestino: string) => Promise<void>;
    onEditClick: (idDetalleDestino: string) => Promise<void>;
    data: MemorandumrrhhFormModel | null;
};


export const DetalleTableComponent = (props: Props,ref: React.Ref<MemorandumDetalleTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, memorandumId, data} = props;
    const notify = useNotify();
    const [avatar, setAvatar] = useState("");
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<MemorandumDetallerrhhTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<MemorandumDetallerrhhTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },
        { id: 'cod_memorandum', label: 'Codigo de Memorandum', align: 'center',filter: codigoFilter},
        { id: 'tipo_vehiculo_op', label: 'Vehiculo Oficial o Publico',width:200 , align: 'center'},
        { id: 'destino_reg', label: 'Destino registrado', align: 'center',filter: destinoFilter },
        { id: 'vehiculo_id', label: 'Placa de Vehiculo', align: 'center',width:150 },
        { id: 'num_placa', label: 'Tipo de Vehiculo', align: 'center'},
        { id: 'objetivo_viaje', label: 'Objetivo de Viaje', align: 'center',  width: 240 },
        { id: 'fecha_dia', label: 'Fecha dia de viaje', align: 'center',width:200 },
        { id: 'dia_semana', label: 'Dia Semana', align: 'center',width:150 },
        { id: 'hora_inicio', label: 'Hora Inicio', align: 'center'},
        { id: 'hora_fin', label: 'Hora Fin', align: 'center' },
        { id: 'pernocte', label: 'Pernocte', align: 'center' },
        { id: 'hay_viaje', label: 'Estado Dia', align: 'center',width:150, render: renderColumnStatus },     
       // { id: 'modificacion', label: 'Modificacion', align: 'center' },
        { id: 'observacion', label: 'Observacion', align: 'center' },
        { id: 'estado_observacion', label: 'Estado Observacion', align: 'center', render:renderModificacionStatus },

    ];

    const handleUpdateTable = (params: UpdateParams<MemorandumDetallerrhhTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;      
      
        const newParams = {...params,			
            filters: { ...params.filters, memorandum_rrhh_id: memorandumId },};				
        MemorandumDetallerrhhModuleService.getTableDetalleDestino(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<MemorandumDetallerrhhTableModel> = {
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

    function renderColumnActions(data: MemorandumDetallerrhhTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.cod_memorandum + ' - '+data.fecha_dia}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return MemorandumDetallerrhhModuleService.destroyDetalleDestino(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('DetalleDestino eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    type RenderViewDialogProps = {
        open: boolean;
        onClose: () => void;
        imageUrl: string;
    };

    const RenderViewDialog: React.FC<RenderViewDialogProps> = ({ open, onClose, imageUrl }) => {
        return (
          <Dialog open={open} onClose={onClose}>
            <DialogContent>
              <Box
                component="img"
                alt="Imagen ampliada"
                src={imageUrl}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1.5,
                  cursor: 'pointer'
                }}
                onClick={onClose}
              />
            </DialogContent>
          </Dialog>
        );
    };

    function renderColumnStatus(data: MemorandumDetallerrhhTableModel): ReactElement {
        const color = 'white';
        const estado = data.hay_viaje === 'DIA SIN VIAJE'?'DIA SIN VIAJE':'DIA CON VIAJE';
        const background = data.hay_viaje != 'DIA SIN VIAJE'? ESTADO_O[0] : ESTADO_O[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderModificacionStatus(data: MemorandumDetallerrhhTableModel): ReactElement {
        const color = 'white';
        const estado = data.estado_observacion === 'SIN_OBSERVACION' ||data.estado_observacion === ""||data.estado_observacion === null?'SIN_OBSERVACION':'OBSERVADO';
        const background = data.estado_observacion != 'OBSERVADO'? ESTADO_O[0] : ESTADO_O[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    return (
        <Paper>
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    color: 'white',
                    px: 2,
                    py: 1
                }}
            >
            {

                data ?  <Typography variant="body2" component="span" sx={{ color: 'white'}} >
                           <Typography variant="body2" component="span" sx={{ color: 'warning.light', fontWeight: 'bold' }}>Fecha Registro Memorandum:&nbsp;</Typography>{format(new Date(data.fecha_memo_registro), FORMAT).toString()}
                           <br></br>
                            <Typography variant="body2" component="span" sx={{ color: 'warning.light', fontWeight: 'bold'}}>Nombre Memorandum:&nbsp;</Typography>{data.nombre_usuario}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>C.I.:&nbsp;</Typography>{data.ci}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Cargo Usuario:&nbsp;</Typography>{data.cargo_usuario}
                            <br></br>
                            <Typography variant="body2" component="span" sx={{ color: 'warning.light', fontWeight: 'bold'}}>Codigo:&nbsp;</Typography>{data.cod_depart_memo}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Cantidad de dias:&nbsp;</Typography>{data.cantidad_dias}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Inicio:&nbsp;</Typography>{format(new Date(data.fecha_inicio_viaje), FORMAT).toString()}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Final:&nbsp;</Typography>{format(new Date(data.fecha_fin_viaje), FORMAT).toString()}
                        </Typography>
                        :<Typography variant="subtitle1" component="span">Cargando...</Typography>
            }
            </Box>
            {RenderViewDialog({ open, onClose: handleClose, imageUrl: getAvatarURL(avatar) })}
            <DataTable
               ref={tableRef}
               headers={tableHeaders}
               updateParams={tableParams}
               onUpdate={handleUpdateTable}
               onActionAddClick={onAddClick}
               vScroll
            />
        </Paper>
    );


};

export const MemorandumDetallerrhhTable = forwardRef(DetalleTableComponent);
