import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
//import { Box } from '@mui/material';
import { Box, Dialog, DialogContent, Paper, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model

//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_DIAS_SEMANA, ESTADO_E, ESTADO_I } from 'constants/colors';

import { STORAGE_URL } from 'config/app-config';
import { ENUM_ESTADOS_B, ENUM_ESTADOS_G, STORAGE_LOCAL } from 'constants/enums';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { ViaticoFormModel } from 'modules/viatico/viatico/components/ViaticoFormDialog';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { ViaticoDetalleModuleService } from '../ViaticoDetalleModuleService';
import { DetalleDestinoTableModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoTable';
import { getAvatarURL } from 'utils';


export type ViaticoDetalleDestinoTableModel = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida         : string;
    tipo_vehiculo_opvuelta         : string;
    estado                    : string;
    memorandum_id?            : string;
    viatico_id?               : string;
   // vehiculo_id              : string;
    destino_id?               : string;
    destino_id2?               : string;
    activo                   : boolean;
    modificacion?            : boolean;
    observacion?             : string;
    estado_observacion?      : string;    

    estado_destino?          : string;
    dia_semana?              : string;
  //  notificacion_ddestino      :string ;
  //  destino_escala        : string;


   // aumentamos campos vehiculo
    vehiculo_id? : string;
    num_placa? : string;
    cod_memorandum? :string;

   //Datos del usuario
    usuario_nombre?          : string;
    cod_depart_memo?         : string;
    ci?                      : number;
    cargo_usuario?           : string;
    fecha_memo_registro?     : Date;
    tipo_comision_idp?       : string;
    fecha_inicio_viaje?      : Date;
    fecha_fin_viaje?         : Date;
    categoria_usuario?       : string;
    viaticos_por_dia?        : number;
    cantidad_dias?           : number;
    //campos de escala
    categoria?             : string;
    escala?                : string;
    viaticoPorDia?         : number;
    moneda?               : string;
    bolivianos?            : number;
    cargoId?               : string;

    // para las columnas especiales
    actions: unknown;
};


export type ViaticoDetalleDestinoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ViaticoDetalleDestinoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ViaticoDetalleDestinoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 25,
    page: 1
};

const FORMAT = 'dd/MM/yyyy';

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };


type Props = {
    memorandumId  : string;
    viaticoId :string;
    onAddClick: () => void;
    onViewClick: (idDetalleDestino: string) => Promise<void>;
    onEditClick: (idDetalleDestino: string) => Promise<void>;
    data: ViaticoFormModel | null;
};


export const DetalleDestinoTableComponent = (props: Props,ref: React.Ref<ViaticoDetalleDestinoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, memorandumId, viaticoId, data} = props;
    const notify = useNotify();
    const [avatar, setAvatar] = useState("");
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ViaticoDetalleDestinoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ViaticoDetalleDestinoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },//, render: renderColumnActions
        { id: 'cod_memorandum', label: 'Codigo de Memorandum', align: 'center', filter: nombresFilter},//, render: renderColumnActive
        { id: 'tipo_vehiculo_op', label: 'Tipo de Vehiculo Memorandum', align: 'center', filter: nombresFilter},//, render: renderColumnActive
        { id: 'vehiculo_id', label: 'Placa Vehiculo Oficial', align: 'center',width:200 },
        { id: 'num_placa', label: 'Tipo Vehiculo Oficial', align: 'center', filter: nombresFilter},
        { id: 'objetivo_viaje', label: 'Objetivo de Viaje', align: 'center', width: 240 },
        { id: 'destino_reg', label: 'Destino registrado', align: 'center', filter: nombresFilter },
        { id: 'fecha_dia', label: 'Fecha dia de viaje', align: 'center',  filter: partidaFilter },
        { id: 'pernocte', label: 'Pernocte', align: 'center' },
        { id: 'hora_inicio', label: 'Hora Inicio', align: 'center' },
        { id: 'hora_fin', label: 'Hora Fin', align: 'center' },
        { id: 'tipo_vehiculo_opvida', label: 'Tipo de Vehiculo Ida', align: 'center',width:150 },
        { id: 'destino_id', label: 'Modalidad Vehiculo', align: 'center',width:150 },
        { id: 'pasaje_ida', label: 'Pasaje de Ida', align: 'center' },
        { id: 'tipo_vehiculo_opvuelta', label: 'Tipo de Vehiculo Retorno', align: 'center',width:200 },
        { id: 'destino_id2', label: 'Modalidad Vehiculo', align: 'center',width:150 },
        { id: 'pasaje_retorno', label: 'Pasaje de Retorno', align: 'center' },
        { id: 'total_pasaje_dia', label: 'Total Pasaje Dia', align: 'center' },
        { id: 'modificacion', label: 'Modificacion', align: 'center' },
        { id: 'observacion', label: 'Observacion', align: 'center' },
        { id: 'estado_observacion', label: 'Estado Observacion', align: 'center' },
        { id: 'dia_semana', label: 'Dia Semana', align: 'center',width:150 , render: renderColumnStatusDiasSemana},
       // { id: 'memorandum_id', label: 'MemorandumID' },//, render: renderColumnActions
       // { id: 'activo', label: 'Estado', align: 'center' },//, render: renderColumnStatus
       { id: 'estado', label: 'Aprobar Estado', align: 'center', render:renderColumnChange },
       { id: 'estado_destino', label: 'Estado Destino', align: 'center', render:renderColumnStatus },
       // { id: 'notificacion_ddestino', label: 'Estado', align: 'center' },//, render:  render:renderColumnStatus
    ];

    const handleUpdateTable = (params: UpdateParams<ViaticoDetalleDestinoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        const newParams = {...params,
            filters: { ...params.filters, memorandum_id: memorandumId }};
        DetalleDestinoModuleService.getTableDetalleDestino(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;

            const filteredResults = result.rows?.filter(item => item.estado === 'PENDIENTE' || item.estado === 'APROBADO');
            const newTableParams: UpdateParams<ViaticoDetalleDestinoTableModel> = {				
                ...params,
                rows: filteredResults || [],
                count: result.count || 0,
                rowsPerPage: 25,
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

    function renderColumnActive(data: ViaticoDetalleDestinoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return DetalleDestinoModuleService.setActiveDetalleDestino(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

   // const [open2, setOpen2] = useState<boolean>(false);
    const optionsVale = ENUM_ESTADOS_G.map((m) => m.value);
    function renderColumnChange(data: DetalleDestinoTableModel): ReactElement {
        if(data.estado==='APROBADO') return (<> - </>);
        return (
            <>
            {/*    <ConfirmDialog
                    title={'Confirmar'}
                    message={'¿La anulacion del Detalle Destino, inhabilitara el formulario llenado?'}
                    open={open2}
                    onAccept={async () => {
                        return DetalleDestinoModuleService.setAprobadoDetalleDestino(data.id, 'ANULADO').then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Se actualizo exitosamente');
                            setOpen2(false);
                            tableRef.current?.refresh();
                        });
                    }}
                    onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                />*/}
                <ChangeStateColumn
                    data={data.estado}
                    options={optionsVale}
                    onChange={async (newValue: any) => {
                      //  if(newValue==='ANULADO') setOpen2(true);
                      //  else
                            return DetalleDestinoModuleService.setAprobadoDetalleDestino(data.id, newValue).then((result) => {
                                if (!result.success) return notify.error(result.msg);
                                notify.success('Se actualizo exitosamente');
                                tableRef.current?.refresh();
                            });
                    }}
                />
            </>
        );
    }


     //cambio de color estado
     function renderColumnStatus(data: DetalleDestinoTableModel): ReactElement {
        const color = 'white';
        const background = ESTADO_I[data.estado];
        return <StatusColumn status={data.estado} color={color} background={background} />;
    }

      //cambio de color estado dias semana
     function renderColumnStatusDiasSemana(data: DetalleDestinoTableModel): ReactElement {
        const color = 'white';
        const background = ESTADO_DIAS_SEMANA[data.dia_semana!];
        return <StatusColumn status={data.dia_semana!} color={color} background={background} />;
    }


    function renderColumnActions(data: ViaticoDetalleDestinoTableModel): ReactElement {

        if(data.estado ==='APROBADO') return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                // deleteMessage={
                //     <div>
                //         <div>¿Quiere eliminar el registro de Destino?</div>
                //         <br />
                //         <div>
                //             {/*data. sigla   y data. nombre  <strong>Nombre: </strong> {data.fecha_dia +' - '+data.id}  cambiar por una id mas representativa*/}
                //             <strong>Nombre: </strong> {data.cod_memorandum }
                //         </div>
                //     </div>
                // }
                // onDeleteClick={async () => {
                //     return DetalleDestinoModuleService.destroyDetalleDestino(data.id).then((result) => {
                //         if (!result.success) return notify.error(result.msg);
                //         notify.success('DetalleDestino eliminado exitosamente');
                //         tableRef.current?.refresh();
                //     });
                // }}
            />
        );
    }

    const [open, setOpen] = useState(false);

    const handleImageClick = (avatar: string) => {
        setAvatar(avatar)
        setOpen(true);
    };

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

     /*function renderColumnStatus(data: ViaticoDetalleDestinoTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }*/

    function renderColumnPadre(data: ViaticoDetalleDestinoTableModel): ReactElement {
        // se cambia lo de padre por activo pero se debe verificar
        const padre = data.activo?'SI':'NO';
        return <StatusColumn status={padre} background={BACKGROUND_1}/>;
    }



    return (
        <Paper>
            <Box
                sx={{
                    backgroundColor: 'success.dark',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    color: 'white',
                    px: 2,
                    py: 1
                }}
            >
            {

                data ?  <Typography variant="body2" component="span" sx={{ color: 'white'}} >
                            <Typography variant="body2" component="span" sx={{ color: 'warning.light', fontWeight: 'bold'}}>Nombre Usuario:&nbsp;</Typography>{data.usuario_nombre}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>C.I:&nbsp;</Typography>{data.ci}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Cargo:&nbsp;</Typography>{data.cargo_usuario}
                         {/*   <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Memorandum:&nbsp;</Typography>{format(new Date(data.fecha_memo_registro), FORMAT).toString()} */}
                         <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Memorandum:&nbsp;</Typography>{(data.fecha_memo_registro).toString()}
                             <br></br>
                            <Typography variant="body2" component="span" sx={{ color: 'warning.light', fontWeight: 'bold'}}>Codigo:&nbsp;</Typography>{data.cod_depart_memo}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Cantidad de dias:&nbsp;</Typography>{data.cantidad_dias}
                          {/*   <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Inicio:&nbsp;</Typography>{format(new Date(data.fecha_inicio_viaje), FORMAT).toString()}
                            <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Final:&nbsp;</Typography>{format(new Date(data.fecha_fin_viaje), FORMAT).toString()}*/}
                             <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Inicio:&nbsp;</Typography>{(data.fecha_inicio_viaje).toString()}
                             <Typography variant="body2" component="span" sx={{ pl: 4, color: 'warning.light', fontWeight: 'bold' }}>Fecha Final:&nbsp;</Typography>{(data.fecha_fin_viaje).toString()}
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
              // onActionAddClick={onAddClick}
               vScroll
            />

        </Paper>
    );



    /*return (
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
    );*/
};

export const ViaticoDetalleDestinoTable = forwardRef(DetalleDestinoTableComponent);
