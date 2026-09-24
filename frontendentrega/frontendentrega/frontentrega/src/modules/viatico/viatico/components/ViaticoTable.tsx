import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
//import { Box } from '@mui/material';
import { Badge, Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ViaticoModuleService } from 'modules/viatico/viatico/ViaticoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_E, ESTADO_TIPO_MEMO_REPO } from 'constants/colors';
import { ANULADO, APROBADO, ENUM_ESTADOS_F, ENUM_ESTADOS_PAGO } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { Print } from '@mui/icons-material';
import { getAvatarURL } from 'utils';
import { ReporteMemorandumTableModel } from 'modules/viatico/memorandum/components/MemorandumTable';
import { ViaticoAnularFormModel } from './ViaticoFormDialog';

export type ViaticoTableModel = {
    id: string;
     //Ingresando nuevos parametros de memorandum y escala
     cod_memorandum : string;
     fecha_memo : Date;
     usuario_id : string;
     ci: string;
     destino_id : string;
     tipo_comision_idp : string;
     fecha_viaje_ida : Date;
     fecha_viaje_retorno : Date;
     cantidad_dias :number;
     transporte_op : string;
     apertura_prog : string;
     fondo_financia : string;
     sisin : string;
     usuario_cel?   : string;
     //activo                : boolean;
     //tabla viaticos
    nume_recibo           : number;
    fecha_pago_viatico    : Date;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : Date;
    notificacion_viatico  : string;

    memorandum_id?          : string | null; //aumentado
    escala_id?              : string | null; //aumentado
    activo                 : boolean;
    fecha_format_memo?      :string;
    tipo_memo_repo?         : string | null; //aumentado
     //campos de escala
     categoria?             : string;
     escala?                : string;
     viaticoPorDia?         : number;
     moneda?                : string;
     bolivianos?            : number;
     cargoId?               : string;
     conteo_dias_detalle   : number;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    imprimir: string;
    imprimir_memorandum: string;
    // campos de imagen
    imagen                : string;
    //campos de memorandum para rrhh
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    usuario_tipo?            : string,
    notificacion_memo?       : string,
    estado_memorandum?       : string,

};

export type ReporteViaticoTableModel = {
    id: string;
     //Ingresando nuevos parametros de memorandum y escala
     cod_memorandum : string;
     fecha_memo : Date;
     usuario_id : string;
     ci: string;
     destino_id : string;
     tipo_comision_idp : string;
     fecha_viaje_ida : Date;
     fecha_viaje_retorno : Date;
     transporte_op : string;
     apertura_prog : string;
     fondo_financia : string;
     sisin : string;
     cantidad_dias :number;
     conteo_dias_detalle   : number;

     //activo                : boolean;
     //tabla viaticos
    nume_recibo           : number;
    fecha_pago_viatico    : Date;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : Date;
    notificacion_viatico  : string;

    memorandum_id?          : string | null; //aumentado
    escala_id?              : string | null; //aumentado

    activo                 : boolean;
     //campos de escala
     categoria?             : string;
     escala?                : string;
     viaticoPorDia?         : number;
     moneda?                : string;
     bolivianos?            : number;
     cargoId?               : string;

};
export type DatosMessage = {
    id              : string;
    nombre_usuario  : string;
    cod_memo        : string;
    nume_recibo     : number;

}

export type ViaticoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ViaticoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ViaticoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const estadosFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_PAGO};


type Props = {
    onAddClick: () => void;
    onAnularClick: () => void;
    onViewClick: (idViatico: string) => Promise<void>;
    //Se aumenta onpago para realizar el pago
    onPagoClick: (idViatico: string,memoId:string) => void;
    onEditClick: (idViatico: string) => Promise<void>;
    onImprimirClick: (data: ReporteViaticoTableModel) => void;
    onImprimirClickMemorandum: (data: ViaticoTableModel) => void;  //cambiar areporte
    loading: string;  
    loading2: string;
};

export const ViaticoTableComponent = (props: Props, ref: React.Ref<ViaticoTableRefProps>): ReactElement => {
    const { onViewClick,onAddClick, onAnularClick,onPagoClick, onEditClick, loading,onImprimirClick, loading2, onImprimirClickMemorandum} = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ViaticoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ViaticoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false , render:renderColumnActions},

        { id: 'nume_recibo', label: 'Numero de Recibo', align: 'center', width:150 , filter: nombresFilter },
        { id: 'cod_memorandum', label: 'Codigo de Memorandum', align: 'center', width:250 , filter: nombresFilter },
        { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width:150 , filter: nombresFilter, render: renderColumnStatusMemoRepo },
        { id: 'fecha_format_memo', label: 'Fecha de Memorandum', align: 'center', width:150 , filter: nombresFilter },
        { id: 'usuario_id', label: 'Nombre Completo', align: 'center', width:250 , filter: nombresFilter, render:renderColumnSolicitante },
        { id: 'ci', label: 'C.I.', align: 'center', filter: nombresFilter },
        { id: 'usuario_cel', label: 'Celular', align: 'center' },
        { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', width:150 },
        { id: 'destino_id', label: 'Destino', align: 'center', width:150 , filter: nombresFilter },
        { id: 'fecha_viaje_ida', label: 'Fecha Inicio Viaje', align: 'center', width:150},
        { id: 'fecha_viaje_retorno', label: 'Fecha Fin Viaje', align: 'center', width:150},
        { id: 'cantidad_dias', label: 'Cantidad de Dias', align: 'center' },
        { id: 'transporte_op', label: 'Tipo de transporte', align: 'center' },
        { id: 'apertura_prog', label: 'Apertura Programatica', align: 'center', width:150 , filter: nombresFilter},
        { id: 'fondo_financia', label: 'Fondo de Financiamiento', align: 'center'},
        { id: 'sisin', label: 'SISIN', align: 'center', width:250 },
        { id: 'fecha_anulacion', label: 'Fecha de Anulacion', align: 'center',width:150, },
       // { id: 'nume_recibo', label: 'Numero de Recibo', align: 'center', width:150 },
        { id: 'fecha_pago_viatico', label: 'Fecha Pago de Viatico', align: 'center', width:150, filter: nombresFilter },
        { id: 'suma_pasaje_ida', label: 'Suma Pasaje Ida', align: 'center', width:150 },
        { id: 'suma_pasaje_retorno', label: 'Suma Pasaje Retorno', align: 'center', width:160},
       // { id: 'tipo_pasaje_gd', label: 'Tipo Pasaje General/Detallado', align: 'center', width:180, filter: nombrePadreFilter },
        { id: 'total_pasajes', label: 'Total Pasajes', align: 'center', width:150 },// render: renderColumnPadre,
        { id: 'total_viatico', label: 'Total Viatico', align: 'center',width:150 },//, render: renderColumnActive
        { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center',width:150 },
        { id: 'estado_pago', label: 'Pago Viatico', align: 'center', width:150, render:renderColumnChange, filter:estadosFilter },
      //  { id: 'estado_recibo', label: 'Estado Recibo', align: 'center',width:150, filter: partidaFilter },
      
        { id: 'notificacion_viatico', label: 'Estado', align: 'center', render:renderColumnStatus},
      //  { id: 'activo', label: 'Estado', align: 'center' },//, render: renderColumnStatus
        { id: 'options', label: 'Detalle Destino', sort: false, width:200, render:renderColumnOptions, align: 'center' },//, render: renderColumnStatus
        { id: 'imprimir', label: 'Descargar Recibo', sort: false, render: renderImpresionOptions, align: 'center' ,width:100},//render: renderImpresionOptions,
         { id: 'imprimir_memorandum', label: 'Imprimir Memorandum', sort: false, render: renderImpresionMemorandum, align: 'center' ,width:100},//render: renderImpresionOptions,
    ];

    const handleUpdateTable = (params: UpdateParams<ViaticoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ViaticoModuleService.getTableViatico(params as QueryParams).then((result) => {
			
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ViaticoTableModel> = {
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

   /* function renderImpresionOptions(data: ReporteViaticoTableModel): ReactElement {
        return (
            <>
                <IconButton size="small" disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="error">
                    {loading===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                </IconButton>
            </>
        );
    }*/

   function renderImpresionMemorandum(data: ViaticoTableModel): ReactElement {
        const isComplete = data.cantidad_dias === data.conteo_dias_detalle;
                // Define el color del botón basado en si los valores están completos
        const buttonColor =  isComplete ? 'info' : 'error';
                // Define el mensaje a mostrar si los datos no están completos
        const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
        return (
            <>
             {isComplete && (
                 <Tooltip title = "Memorandum a imprimir">
                 <IconButton size="small" disabled={loading2===data.id} onClick={() => onImprimirClickMemorandum(data)} color="error">
                  {loading2===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                 </IconButton>
                 </Tooltip>
              )}
          </>
         );
     }

    useImperativeHandle(ref, tableRefHandler, [tableParams]);

   /* function renderColumnActive(data: ViaticoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return ViaticoModuleService.setActiveViatico(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }*/

    function renderColumnActions(data: ViaticoTableModel): ReactElement {
       // const VIATICO_ID = data.id;
       if(data.estado_pago===APROBADO || data.estado_pago===ANULADO) return(
        <ActionColumn
            onViewClick={() => onViewClick(data.id)}
        />
       );
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                /*deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.fecha_memo+' - '+data.tipo_comision_idp}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ViaticoModuleService.destroyViatico(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Viatico eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}*/
            />
        );
    }

 //proceso de aprobacion

 const [open2, setOpen2] = useState<boolean>(false);
 const [approve, setApprove] = useState<boolean>(false);
 const [aproveIdN, setAproveIdN] = useState<DatosMessage>();
 const [aproveIdA, setAproveIdA] = useState<DatosMessage>();
 const optionsVale = ENUM_ESTADOS_F.map((m) => m.value);
 function renderColumnChange(data: ViaticoTableModel): ReactElement {

     if(data.estado_pago===ANULADO || data.estado_pago===APROBADO ) return (<> - </>);
     return (
         <>
             <ConfirmDialog
                 title={' Confirmar ANULACION'}
                 message={
                    <span>
                   ¿La anulacion del Viatico, inhabilitara el formulario llenado?
                    <br />
                    Nombre Beneficiario:  {aproveIdN?.nombre_usuario}
                    <br />
                    Nº Memo: {aproveIdN?.cod_memo}
                    <br />
                    Nº Recibo:  {aproveIdN?.nume_recibo}
                    <br />
                    ¿esta usted seguro?
                    </span>
                    }
                 open={open2}
                 onAccept={async () => {
                     return ViaticoModuleService.setAprobadoViatico(aproveIdN?.id!, ANULADO).then((result) => {
                         if (!result.success) return notify.error(result.msg);
                         notify.success('Se actualizo exitosamente');
                         setOpen2(false);
                         tableRef.current?.refresh();
                     });
                 }}
                 onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
             />
             <ConfirmDialog
                 title={' Confirmar APROBACION'}
                 message={
                    <span>
                    Se aprobara el Viatico y pasara al Modulo de DESCARGO, esta usted seguro de APROBAR este viatico?
                    Una vez aceptado se procedera a la descarga del monto de la apertura respectiva sin posibilidad de cancelacion.
                    <br />
                    Nombre Beneficiario:  {aproveIdA?.nombre_usuario}
                    <br />
                    Nº Memo: {aproveIdA?.cod_memo}
                    <br />
                    Nº Recibo:  {aproveIdA?.nume_recibo}
                    <br />
                    ¿esta usted seguro?
                    </span>
                 }
                 open={approve}
                 onAccept={async () => {
                     return ViaticoModuleService.setAprobadoViatico(aproveIdA?.id!, 'APROBADO').then((result) => {
                         if (!result.success) return notify.error(result.msg);//.error("Debe revisar el Saldo de las Aperturas o Debe revisar si todos los destinos estan APROBADOS o si Registro el Numero de recibo");//notify.error(result.msg);
                         notify.success('Se actualizo exitosamente');
                         setApprove(false);
                         tableRef.current?.refresh();
                     });
                 }}
                 onCancel={() => { isMounted() && setApprove(false); tableRef.current?.refresh(); }}
             />
             <ChangeStateColumn
                 data={data.estado_pago}
                 options={optionsVale}
                 onChange={async (newValue: any) => {

                     if(newValue===ANULADO) {setOpen2(true)
                         setAproveIdN({id:data.id, nombre_usuario: data.usuario_id, cod_memo: data.cod_memorandum,nume_recibo: data.nume_recibo});
                     }
                     else if (newValue === 'APROBADO') {
                        setApprove(true);
                        setAproveIdA({id:data.id, nombre_usuario: data.usuario_id, cod_memo: data.cod_memorandum,nume_recibo: data.nume_recibo}); } // Abre el diálogo para 'APROBADO'

                     else
                         return ViaticoModuleService.setAprobadoViatico(data.id, newValue).then((result) => {
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
     function renderColumnStatusMemoRepo(data: ViaticoTableModel): ReactElement {
         const estado = data.tipo_memo_repo!;
         const color = 'white';
         const background = ESTADO_TIPO_MEMO_REPO[estado];
         const texto = estado;
         return <StatusColumn status={texto} color={color} background={background} />;
     }
 

 //cambio de color estado
 function renderColumnStatus(data: ViaticoTableModel): ReactElement {
     const color = 'white';
     const background = ESTADO_E[data.estado_pago];
     return <StatusColumn status={data.estado_pago} color={color} background={background} />;
 }


    function renderColumnSolicitante(tableModel: ViaticoTableModel): ReactElement {
        if(tableModel.usuario_id==="-") return (<> - </>);	
            const imagen = tableModel.imagen;
            return  (
                <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                    <Box
                        component="img"
                        alt={tableModel.usuario_id}
                        src={getAvatarURL(imagen)}
                        sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                    />
                    <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">{tableModel.usuario_id}</Typography>
                       {/* <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.usuario_cargo}</Typography>*/}
                    </Box>
                </Box>
            );
        }

    function renderColumnOptions(data: ViaticoTableModel): ReactElement {

        const isComplete = data.cantidad_dias === data.conteo_dias_detalle;

     // Define el color del botón basado en si los valores están completos
    const buttonColor =  isComplete ? 'info' : 'error';
    // Define el mensaje a mostrar si los datos no están completos
    const message = !isComplete ? 'Los destinos aun se encuentran en PENDIENTE (Revisar Destinos)' : 'Destinos APROBADOS';
    if(data.estado_pago===ANULADO || data.estado_pago===APROBADO) return (<> - </>);
    return (

            <>
               <Box display="flex" alignItems="center">
                    <Tooltip title={message} arrow>
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => onPagoClick(data.id,data.memorandum_id!)}
                                color={buttonColor}
                            >
                                <ListAltIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {!isComplete && (
                        <Typography color={buttonColor} variant="caption" sx={{ ml: 1 }}>
                            {message}
                        </Typography>
                    )}
                     {isComplete && (
                        <Typography color={'#4C90E4'} variant="caption" sx={{ ml: 1 }}>
                            {message}
                        </Typography>
                    )}

                </Box>

            </>
        );

    }


    function renderImpresionOptions(data: ReporteViaticoTableModel): ReactElement {

        const isComplete = data.cantidad_dias === data.conteo_dias_detalle && data.nume_recibo !== 0 ;
        // Define el color del botón basado en si los valores están completos
        const buttonColor =  isComplete ? 'info' : 'error';
        // Define el mensaje a mostrar si los datos no están completos
        const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
        return (
            <>
                    {isComplete && (
                        <IconButton size="small" disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="primary">
                        {loading===data.id ? <CircularProgress size={16}  />:<Print />}
                        </IconButton>
                    )}
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
                onActionAnularClick={onAnularClick}  
              //  onActionAddClick={onAddClick} //icono de agregar
                vScroll
            />
        </>
    );
};

export const ViaticoTable = forwardRef(ViaticoTableComponent);
