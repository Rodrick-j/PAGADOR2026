import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
//import { Box } from '@mui/material';
import { Box,CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';

import {  ANULADO, APROBADO_CONTABILIDAD, APROBADO_SECRETARIO, ENUM_CON_SIN_OBSERVACIONES, ENUM_ESTADOS_APROBADOS, ENUM_ESTADOS_APROBADOS_JEFES, ENUM_ESTADOS_APROBADOS_RRHH, ENUM_ESTADOS_APROBADOS_SDAFP, ENUM_ESTADOS_H, ENUM_IS_SUPERADMINISTRADOR, ENUM_TIPO_COMBUSTIBLE, ENUM_TIPO_COMISION, ENUM_TIPO_MEMORANDUM, ENUM_TIPO_MEMORANDUM_RRHH, ESTADOS_BLOQUEADOS, ESTADOS_SOLO_VISTA, JEFE, MEMORANDUM_FUNCIONES, OBSERVADO, OPTIONS_TIPO_MEMOREPOSICION, RECHAZADO, ROLES_EDICION, ROLES_TECNICOS_VIATICOS, SIN_OBSERVACION, STORAGE_LOCAL, TECNICO_COMBUSTIBLE_JEFE, TECNICO_COMPLETO, TECNICO_RRHH, TECNICO_VALE_VIATICOS, TECNICO_VIATICOS, VERIFICADO_RRHH } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { ESTADO_APROBADO_JEFE, ESTADO_O } from 'constants/colors';
//import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';  ///CORRREGIR
import { getAvatarURL } from 'utils';
import { SelectOption } from 'components/core/FormDialog';
import ModalPersonalizadoDialog from 'components/ModalPersonalizado';
import { MemorandumrrhhModuleService } from '../MemorandumrrhhModuleService';
import { MemorandumDetallerrhhModuleService } from 'modules/rrhh/memorandum_detalle_rrhh';

export type MemorandumrrhhTableModel = {
    id: string;
    cod_depart_memo        : string;
    tipo_memorandum        :string;
    //campos que se aumentan
    usuario_nombre         :string;
    usuario_cargo          : string;
    ci                     : string;
    nume_celular           : string;
    usuario_area?          : string;    
    // campos de imagen
    imagen                : string;
    imagen2               : string;
      //Campos para imprimir
     imprimir             : string;
     //campos Memorandum
    autorizado_por         : any[];
    cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date;
    fecha_memo_format      : string;
    vehiculo_id            : string; //tipo de vehiculo marca  TV
    num_placa              : string; //placa del vehiculo  TV
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
    tipo_memo_repo         : boolean;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
    //Modificacion
    modificacion           : boolean;
    obs_modificacion      : string ;
    fecha_cambio          : string;
    estado_modificacion   : string;
    //detalle Destino dias
    conteo_dias_detalle    : number;
    contrato?              : string;
    lista_select_jefes?    : SelectOption[];
    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type ReporteMemorandumrrhhTableModel = {
    id: string;
    cod_depart_memo        : string;
    tipo_memorandum        :string;
    //campos que se aumentan
    usuario_nombre         :string;
    usuario_cargo          : string;
    ci                     : string;
    nume_celular  : string;  
    // campos de imagen
    imagen                : string;
    imagen2               : string;
    //Campos para imprimir
    imprimir             : string;
    //campos Memorandum
    autorizado_por         : any[];
    cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date;
    vehiculo_id               : string; //tipo de vehiculo marca  TV
    num_placa                  : string; //placa del vehiculo  TV
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
    tipo_memo_repo         : boolean;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
    modificacion           : boolean;
    obs_modificacion      : string ;
    fecha_cambio          : string;
    estado_modificacion   : string;
    //detalle Destino dias
    conteo_dias_detalle    : number;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type DatosMessage = {
    id              : string;
    nombre_usuario  : string;
    cod_memo        : string;
    tipo_comision_idp   : string;

}

export type MemorandumTableRefProps = {
    refresh: (updateParams?: UpdateParams<MemorandumrrhhTableModel>) => void;
    getQueryParams: () => QueryParams;
};


export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<MemorandumrrhhTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};


//const nombrePadreFilter: HeaderFilter = { type: 'text' };
const textFilter: HeaderFilter = { type: 'text' };
const fechaFilter: HeaderFilter = { type: 'date' };
const tipoMemorandumFilter: HeaderFilter = { type: 'select', options: ENUM_TIPO_MEMORANDUM_RRHH};
const tipoComisionFilter: HeaderFilter = { type: 'select', options: ENUM_TIPO_COMISION };
//const tipoMemoReposicion: HeaderFilter = { type: 'select', options: OPTIONS_TIPO_MEMOREPOSICION };


type Props = {
    onAddClick: () => void;
    onViewClick: (idMemorandum: string) => Promise<void>;
    onDetalleMemorandumClick: (idMemorandum: string) => void;
    onEditClick: (idMemorandum: string) => Promise<void>;
    onImprimirClick: (data: ReporteMemorandumrrhhTableModel) => void;  //cambiar areporte
    loading: string;
    loading2: string;
};

export const MemorandumrrhhTableComponent = (props: Props, ref: React.Ref<MemorandumTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick,onDetalleMemorandumClick, onEditClick , onImprimirClick, loading, loading2 } = props;
   // const { onDetalleMemorandumClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<MemorandumrrhhTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);
    const authUser = useSession();


    let tableHeaders: TableHeader<MemorandumrrhhTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, width:150, render:renderColumnActions},
        { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center',  width:250  , filter: textFilter },
        { id: 'tipo_memorandum', label: 'Tipo de Memorandum', align: 'center',  width:320 , filter: tipoMemorandumFilter  },
        { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
        { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', width:250, render: renderColumnSolicitante, filter: textFilter },
        { id: 'ci', label: 'CI', align: 'center', filter: textFilter,width:80 },
        { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
        { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
        { id: 'options', label: 'Detalles del Destino', sort: false,width:200, render:renderColumnOptions, align: 'center' },
        { id: 'imprimir', label: 'Descargar Memorandum', sort: false,width:150, render: renderImpresionOptions, align: 'center' },
        { id: 'contrato', label: 'Item/contrato', align: 'center', width:150, filter: textFilter },
        { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
        //aumentando campos de apertua
        { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center',width:300, render: renderColumnResponsable},
        { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', filter: tipoComisionFilter },
        { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: fechaFilter },
        { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
        { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center'},
        { id: 'usuario_area', label: 'Area de solicitud de Memorandum', align: 'center',filter: textFilter},
        { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center'  },
        { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
        { id: 'observacion', label: 'Observacion', align: 'center',width:320 },
      

       { id: 'modificacion', label: 'Modificaciones', align: 'center', width: 150, render: renderColumnActive  },
       { id: 'obs_modificacion', label: 'Observaciones', align: 'center', width: 200, },
       { id: 'fecha_cambio', label: 'Fechas de Cambio', align: 'center', width: 100,   },
        { id: 'estado_modificacion', label: 'Estado Modificaciones', align: 'center', width: 180, render: renderModificacionStatus  }

    ];

    const handleUpdateTable = (params: UpdateParams<MemorandumrrhhTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        MemorandumrrhhModuleService.getTableMemorandum(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<MemorandumrrhhTableModel> = {
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

    const [rangoFechas, setRangoFechas] = useState<{ id: Date; nombre: string; caption: string }[]>([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);

    function renderColumnActive(data: MemorandumrrhhTableModel): ReactElement {
        const fechaInicio = String(data.fecha_inicio_viaje);	
        const fechaFin = String(data.fecha_fin_viaje);		
        const fechaActual = new Date();
		
        const [dia, mes, anio] = fechaInicio.split('/');
        const [dia2, mes2, anio2] = fechaFin.split('/');
        const fechaInicioDate = new Date(`${anio}-${mes}-${dia}T00:00:00`);
        const fechaFinDate = new Date(`${anio2}-${mes2}-${dia2}T24:00:00`);
       
		if (fechaActual >= fechaInicioDate && fechaActual <= fechaFinDate) {
		

            return (

                // Render
                <>
                <ActiveColumn
                    active={data.modificacion!}
                    onActiveChange={async (newValue) => {
                    setSwitchValue(newValue);        // Guardamos valor del switch
                    setActiveRowId(data.id);         // Guardamos ID para luego usarlo
                    //cargamos el listado de fechas segun seleccion
                    const response = await MemorandumDetallerrhhModuleService.getRangoFechas(data.id);

                    if (response.success) {
                        const data = response?.rows;
                        if (Array.isArray(data)) {
                        setRangoFechas(data);
                        } else {
                        setRangoFechas([]);
                        }
                    }

                    setOpenModal(true);              // Abrimos el modal
                    return Promise.resolve();        // Para cumplir con la promesa esperada
                    }}
                />

                <ModalPersonalizadoDialog
                    open={openModal}
                    mainMessage='Esta seguro de MODIFICAR el memorandum?'
                    obs = {ENUM_CON_SIN_OBSERVACIONES}
                    message='Una vez modificado el memorandum se enviara al area de RR.HH. para su revision lo que implica que no podra volver a modificarlo'
                    rangoFechas= {rangoFechas}
                    onClose={() => setOpenModal(false)}
                    onConfirm={async (estadoModif, observaciones) => {

                    const result = await MemorandumrrhhModuleService.setActiveMemorandum(activeRowId!, switchValue, rangoFechas, observaciones,estadoModif );
                    if (!result.success) return notify.error(result.msg);
                    notify.success('Estado actualizado exitosamente');
                    setOpenModal(false);
                    tableRef.current?.refresh();

                    }}
                />
                </>

            );

        } else {
            return <>{'-'}</>;
        }
    }

      function renderModificacionStatus(data: MemorandumrrhhTableModel): ReactElement {
           const color = 'white';
           const estado = data.estado_modificacion === SIN_OBSERVACION?SIN_OBSERVACION:OBSERVADO;
           const background = data.estado_modificacion != OBSERVADO? ESTADO_O[0] : ESTADO_O[1];
           return <StatusColumn status={estado} color={color} background={background} />;
       }


    function renderColumnActions(data: MemorandumrrhhTableModel): ReactElement {
        if(ESTADOS_SOLO_VISTA.includes(data.estado_memorandum)) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
         if(ROLES_EDICION.includes(authUser.roles)) return(

            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/*data.sigla y data.nombre <strong>Nombre: </strong> {data.cod_depart_memo +' - '+data.id}*/}
                            <strong>Codigo: </strong> {data.cod_depart_memo}<br></br>
                            <strong>Fecha Creacion Memorandum: </strong> {' - '+data.fecha_memo_format}<br></br>
                            <strong>Usuario Memorandum: </strong> {' - '+data.usuario_nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return MemorandumrrhhModuleService.destroyMemorandum(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Memorandum eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
               // onEditClick={() => onEditClick(data.id)}
                
            />
        );        
    }


        function renderColumnResponsable(tableModel: MemorandumrrhhTableModel): ReactElement {
            const imagen = tableModel.imagen2;
            const autorizados = tableModel.autorizado_por || []; // por si viene vacío o null

            return (
              <Box display="flex" flexDirection="row" alignContent="space-evenly">
                <Box
                  component="img"
                  alt="Foto"
                  src={getAvatarURL(imagen)}
                  sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                  {autorizados.map((persona, index) => (
                    <Box key={persona.id || index}>
                      <Typography variant="subtitle2">{persona.fullname}</Typography>
                      <Typography
                        color="tertiary"
                        variant="caption"
                        sx={{ fontSize: '10px' }}
                      >
                        {persona.cargo}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          }



    function renderColumnSolicitante(tableModel: MemorandumrrhhTableModel): ReactElement {
        const imagen = tableModel.imagen;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.usuario_nombre}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.usuario_nombre}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.usuario_cargo}</Typography>
                </Box>
            </Box>
        );
    }

// Función para combinar las opciones del backend con las del frontend
function combinarOpciones(backendOptions: SelectOption[],  enumOptions: { value: string, label: string }[]): string[] {
    const todasLasOpciones = [...backendOptions, ...enumOptions];
    const valoresUnicos = new Set<string>();
    const valoresFinales: string[] = [];

    todasLasOpciones.forEach((opcion) => {
        const valor = String(opcion.value); // 🔧 conversión a string segura
        if (!valoresUnicos.has(valor)) {
            valoresUnicos.add(valor);
            valoresFinales.push(valor);
        }
    });

    return valoresFinales;
}


    //proceso de aprobacion
    const [open2, setOpen2] = useState<boolean>(false);
    const [open3, setOpen3] = useState<boolean>(false);
    const [aproveId, setAproveId] = useState<DatosMessage>();  
    const [aproveIdA, setAproveIdA] = useState<DatosMessage>();  
    const optionsRrhh = ENUM_ESTADOS_APROBADOS_RRHH.map((m) => m.value);
   // const optionsSdafp = ENUM_ESTADOS_APROBADOS_SDAFP.map((m) => m.value);

    function renderColumnChange(data: MemorandumrrhhTableModel): ReactElement {
        const optionsJefesMemo = combinarOpciones(data.lista_select_jefes!,ENUM_ESTADOS_APROBADOS);
        //const isComplete = data.cantidad_dias === data.conteo_dias_detalle;

        if (ESTADOS_BLOQUEADOS.includes(data.estado_memorandum)) return <>{'-'}</>;

            if(ROLES_TECNICOS_VIATICOS.includes(authUser.roles)){
                 if(data.estado_memorandum===APROBADO_SECRETARIO || data.estado_memorandum===VERIFICADO_RRHH){return <>{'-'}</>;}
                return (
                    <>
                          <ConfirmDialog
                            title={'Confirmar APROBACION'}
                            message={
                                <span>
                                Esta seguro de APROBAR el memorandum? Una vez APROBADO pasara a RR.HH. para su revision y ya no podra editar el Memorandum
                                , con la APROBACION del Secretario esta determinando que este documento fue aprobado por la jerarquia de jefes anteriores - No olvide Revisar que los destinos esten bien establecidos
                                <br />
                                Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                <br />
                                Nº Memo: {aproveId?.cod_memo}
                                <br />
                                tipo comision:  {aproveId?.tipo_comision_idp}
                                <br />
                                ¿esta usted seguro?
                                </span>
                            }
                            open={open2}
                            onAccept={async () => {

                                return MemorandumrrhhModuleService.setAprobadoMemorandum(aproveId?.id!,APROBADO_SECRETARIO).then((result) => {
                                    if (!result.success) return notify.error(result.msg);
                                    notify.success('Se actualizo exitosamente');
                                    setOpen2(false);
                                    tableRef.current?.refresh();
                                });
                            }}
                            onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                        />
                       <ChangeStateColumn
                            data={data.estado_memorandum}
                            options={optionsJefesMemo}
                            onChange={async (newValue: any) => {
                                if(String(newValue).length === APROBADO_SECRETARIO.length){
                                    setOpen2(true);
                                    setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                }else{
                                   if(data.cantidad_dias === data.conteo_dias_detalle){
                                        MemorandumrrhhModuleService.setAprobadoMemorandum(data.id, newValue).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo exitosamente');
                                        tableRef.current?.refresh();});
                                   }else{
                                        notify.error('Antes de APROBAR debe verificar el detalle del Destino, Destinos incompletos Memorandum NO APROBADO!!');
                                        tableRef.current?.refresh();
                                   }

                                }
                            }}
                        />
                    </>
                );
            }
                //pestaña de aprobacion de recursos humanos
            //if(authUser.roles === TECNICO_RRHH){
               // if(data.estado_memorandum===VERIFICADO_RRHH){return <>{'-'}</>;}
                    return (
                        <>
                              <ConfirmDialog
                                title={'Confirmar APROBACION'}
                                message={
                                    <span>
                                    Esta seguro de APROBAR el memorandum? Una vez VERIFICADO terminara el proceso de revisión y aprobacion - No olvide revisar todos los datos, deben estar correctos.
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    tipo comision:  {aproveId?.tipo_comision_idp}
                                    <br />
                                    ¿esta usted seguro?
                                    </span>
                                }
                                open={open2}
                                onAccept={async () => {

                                    return MemorandumrrhhModuleService.setAprobadoMemorandum(aproveId?.id!,VERIFICADO_RRHH).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo exitosamente');
                                        setOpen2(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                            />
                            <ConfirmDialog
                                title={'Confirmar ANULACION'}
                                message={
                                    <span>
                                    Esta seguro de ANULAR el memorandum? Una vez ANULADO terminara el proceso de revisión y el memorandum quedara inhabilitado para ediciones nuevamente.
                                    <br />
                                    Nombre Beneficiario:  {aproveIdA?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveIdA?.cod_memo}
                                    <br />
                                    tipo comision:  {aproveIdA?.tipo_comision_idp}
                                    <br />
                                    ¿esta usted seguro?
                                    </span>
                                }
                                open={open3}
                                onAccept={async () => {

                                    return MemorandumrrhhModuleService.setAprobadoMemorandum(aproveIdA?.id!,ANULADO).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo exitosamente');
                                        setOpen3(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpen3(false); tableRef.current?.refresh(); }}
                            />
                           <ChangeStateColumn
                                data={data.estado_memorandum}
                                options={optionsRrhh}
                                onChange={async (newValue: any) => {
                                    if(String(newValue).length === VERIFICADO_RRHH.length){										
                                        setOpen2(true);
                                        setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                    }if(String(newValue).length === ANULADO.length){										
                                        setOpen3(true);
                                        setAproveIdA({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                    }if(String (newValue) != ANULADO && String (newValue) != VERIFICADO_RRHH){										
                                        MemorandumrrhhModuleService.setAprobadoMemorandum(data.id, newValue).then((result) => {
											
                                            if (!result.success) return notify.error(result.msg);
                                            notify.success('Se actualizo exitosamente');
                                            tableRef.current?.refresh();});
                                    }
                                }}
                            />
                        </>
                    );
             //   }

       
    }


    //cambio de color estado
    function renderColumnStatus(data: MemorandumrrhhTableModel): ReactElement {
        const estado = data.estado_memorandum;
        const color = 'white';
        const background = ESTADO_APROBADO_JEFE[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }


    function renderColumnOptions(data: MemorandumrrhhTableModel): ReactElement {
	
    const isComplete = data.cantidad_dias === data.conteo_dias_detalle;
     // Define el color del botón basado en si los valores están completos
    const buttonColor =  isComplete ? 'info' : 'error';
    // Define el mensaje a mostrar si los datos no están completos
    const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';

    if(data.tipo_memorandum===MEMORANDUM_FUNCIONES ){return <>{'-'}</>;}
	
    return (

            <>
               <Box display="flex" alignItems="center">
                    <Tooltip title={message} arrow>
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => onDetalleMemorandumClick(data.id)}
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

    function renderImpresionOptions(data: ReporteMemorandumrrhhTableModel): ReactElement {
        const isComplete = data.cantidad_dias === data.conteo_dias_detalle;
        // Define el color del botón basado en si los valores están completos
        const buttonColor =  isComplete ? 'info' : 'error';
        // Define el mensaje a mostrar si los datos no están completos
        const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
        return (
            <>
                    {isComplete && (
                        <Tooltip title = "Memorandum a imprimir">
                            <IconButton size="small" disabled={loading2===data.id} onClick={() => onImprimirClick(data)} color="error">
                            {loading2===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                            </IconButton>
                        </Tooltip>
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
                onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const MemorandumrrhhTable = forwardRef(MemorandumrrhhTableComponent);
