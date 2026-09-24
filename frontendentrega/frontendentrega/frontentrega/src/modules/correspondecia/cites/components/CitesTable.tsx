import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { useSession } from 'hooks/session';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui

import { Box,CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { CitesModuleService } from 'modules/correspondecia/cites';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ENUM_COLOR_TIPO_ACTA, ESTADO_G, ESTADO_Q } from 'constants/colors';
import { OptionsFormModel } from 'modules/Types';
import { ACTIVO, ANULADO, CERRADO, ENUM_ESTADOS_L, IS_ADMINISTRADOR, OPTIONS_DOCUMENTOS } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';

export type CitesTableModel = {
    id: string;    
    fecha_registro          : Date;
    nombre_usuario          : string;
    area_padre              : string; 
    nombre_area_solicitante : string;
    nombre_area_destino     : string;
    cite_completo           : string;
    referencia              : string;
    tipo_documento          : string;
    dias                    : number;
    gestion                 : string;    
    actividad?              : string;            
    nombre_proceso          : string;
    cuce                    : string;
    empresa_adjudicada      : string;
    observacion             : string;    
    hoja_ruta               : string;
    fecha_cierre            : Date;
    modifica_estado         : string;     
    estado                  : string; 
    estado_activo           : boolean; 
    numero_paginas?          : number;
    usuario_creador?         : string;
    usuario_id?             : string;
    tipo_cite_id?           : string;  
    // para las columnas especiales
    activo                  : boolean;
    actions                 : unknown;
    options?                : unknown;
    imprimir?               : unknown;
    
};

export type DatosMessage = {
    id              : string;
    tipo_documento  : string;
    cite_completo   : string;
    nombre_area_solicitante   : string;

}

export type CitesTableRefProps = {
    refresh: (updateParams?: UpdateParams<CitesTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<CitesTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombreUsuarioFilter: HeaderFilter = { type: 'text' };
const nombreAreaFilter: HeaderFilter = { type: 'text' };
const citeFilter: HeaderFilter = { type: 'text' };
const documentoFilter: HeaderFilter = { type: 'select', options: OPTIONS_DOCUMENTOS };
const fechaFilter: HeaderFilter = { type: 'date' };
const hojaRutaFilter: HeaderFilter = { type: 'text' };
const estadoFilter: HeaderFilter = { type: 'select', options: [{value:ACTIVO, label:ACTIVO},{value:CERRADO, label:CERRADO},{value:ANULADO, label:ANULADO},] };


type Props = {
    onAddClick: () => void;
    onViewClick: (idCites: string) => Promise<void>;
    onEditClick: (idCites: string) => Promise<void>;
    onDownloadClick?: () => void;
    onImprimirClick: (data: CitesTableModel) => void;  //cambiar areporte
    loading: string;
};

export const CitesTableComponent = (props: Props, ref: React.Ref<CitesTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick,onDownloadClick, loading, onImprimirClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const optionsEstadoCites = ENUM_ESTADOS_L.map((m) => m.value);;
    const authUser = useSession();
    const [tableParams, setTableParams] = useState<UpdateParams<CitesTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<CitesTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false,render:renderColumnActions },
      //  { id: 'estado_activo', label: 'Activo', align: 'left', render: renderColumnActive },
        { id: 'cite_completo', label: 'Cite Completo', align: 'center', width: 250, filter: citeFilter },
        { id: 'fecha_registro', label: 'Fecha de Registro', align: 'center', width: 100, filter: fechaFilter },
        { id: 'tipo_documento', label: 'Tipo de documento', align: 'center', width: 200, filter: documentoFilter },   
        { id: 'usuario_creador', label: 'Usuario Creador Documento', align: 'center', width: 250, filter: nombreUsuarioFilter },
        { id: 'nombre_area_solicitante', label: 'Area Solicitante', align: 'center', width: 250 },      
        { id: 'nombre_area_destino', label: 'Area destino', align: 'center', width: 250, filter: nombreAreaFilter },
        { id: 'referencia', label: 'Referencia documento', align: 'center', width: 250, filter: nombreAreaFilter },
        { id: 'hoja_ruta', label: 'Hoja de ruta', align: 'center', width: 150, filter: hojaRutaFilter },
        { id: 'observacion', label: 'Observaciones', align: 'center', width: 200 },
        { id: 'dias', label: 'Dias', align: 'center', width: 100 },
        { id: 'nombre_usuario', label: 'Funcionario Destino', align: 'center', width: 250, filter: nombreUsuarioFilter },       
        { id: 'imprimir', label: 'Descargar Documento Cites', sort: false,width:150, render: renderImpresionOptions, align: 'center' },
        { id: 'estado', label: 'Estado', align: 'center',width: 150, render:renderColumnStatus, filter: estadoFilter},//,render:renderColumnStatus
        { id: 'modifica_estado', label: 'Modificacion de Estado', align: 'center', width: 120,render: renderEstadoColumnChange },    
        { id: 'options', label: 'Opciones', align: 'left' },
         { id: 'gestion', label: 'Gestion', align: 'center', width: 100 },        
        { id: 'fecha_cierre', label: 'Fecha de Cierre', align: 'center', width: 150, filter: fechaFilter },
        
    ];

    const handleUpdateTable = (params: UpdateParams<CitesTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        CitesModuleService.getTableCites(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<CitesTableModel> = {
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

   function renderColumnActive(data: CitesTableModel): ReactElement {          

       return (
            <ActiveColumn
                active={data.estado_activo}
                onActiveChange={async (newValue: any) => {
                    return CitesModuleService.setActiveCites(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado Cite actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

function renderImpresionOptions(data: CitesTableModel): ReactElement {
       
        return (
            <>
                    {(
                        <Tooltip title = "Tabla de cites a imprimir">
                            <IconButton size="small" disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="error">
                            {loading===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
            </>
        );
    }

    function renderColumnActions(data: CitesTableModel): ReactElement {

          if(data.estado ===ANULADO|| data.estado===CERRADO) 
          {
            return <ActionColumn
                onViewClick={() => onViewClick(data.id)}               
            />;
          }           
           if(data.usuario_id === authUser.id_usuario || authUser.id_usuario === IS_ADMINISTRADOR)           
          {
            return <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}                
            />;
          }
         
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}                
                //onEditClick={() => onEditClick(data.id)}
                // deleteMessage={
                //     <div>
                //         <div>¿Quiere eliminar el registro?</div>
                //         <br />
                //         <div>
                //             {/*Se cambia a apertura programatica y Cod fte  <strong>Nombre: </strong> {data.apertura_programatica +' - '+data.cod_fte} deberia ser por el area y apertura programatica*/}
                //             <strong>Nombre: </strong> {data.nombre_usuario +' - '+data.cite_completo+' - '+data.tipo_documento}
                //         </div>
                //     </div>
                // }
               /* onDeleteClick={async () => {
                    return CitesModuleService.destroyCites(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Cite eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}*/
            />
        );
    }

    const [open2, setOpen2] = useState<boolean>(false);
    const [anulaId, setAnulaId] = useState<DatosMessage>();

    const [open, setOpen] = useState<boolean>(false);
    const [cierraId, setCierraId] = useState<DatosMessage>();

    function renderEstadoColumnChange(data: CitesTableModel): ReactElement {           
        if(data.estado ===ANULADO|| data.estado===CERRADO) return <>{'-'}</>;
          
             return (
                    <>
                          <ConfirmDialog
                            title={'Confirmar ANULACION'}
                            message={
                                <span>
                                Esta seguro de ANULAR el CITE? Una vez ANULADO ya no podra editar, ni habilitar el CITE 
                                , debe estar seguro de la ANULACION (La numeracion se mantendra con el estado ANULADO) 
                                <br />
                                Tipo documento:  {anulaId?.tipo_documento}
                                <br />
                                Cite completo: {anulaId?.cite_completo}
                                <br />
                                Area Solicitante:  {anulaId?.nombre_area_solicitante}
                                <br />
                                ¿esta usted seguro?
                                </span>
                            }
                            open={open2}
                            onAccept={async () => {        
                                return CitesModuleService.setChangeEstado(anulaId?.id!,ANULADO).then((result) => {
                                    if (!result.success) return notify.error(result.msg);
                                    notify.success('Se actualizo exitosamente');
                                    setOpen2(false);
                                    tableRef.current?.refresh();
                                });
                            }}
                            onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                        />

                         <ConfirmDialog
                            title={'Confirmar CIERRE del documento con CITE'}
                            message={
                                <span>
                                Esta seguro de Cerrar el documento con CITE? Una vez CERRADO ya no podra editar, ni habilitar el CITE 
                                , debe estar seguro de CERRAR el documento con CITE 
                                <br />
                                Tipo documento:  {cierraId?.tipo_documento}
                                <br />
                                Cite completo: {cierraId?.cite_completo}
                                <br />
                                Area Solicitante:  {cierraId?.nombre_area_solicitante}
                                <br />
                                ¿esta usted seguro?
                                </span>
                            }
                            open={open}
                            onAccept={async () => {        
                                return CitesModuleService.setChangeEstado(cierraId?.id!,CERRADO, new Date()).then((result) => {
                                    if (!result.success) return notify.error(result.msg);
                                    notify.success('Se actualizo exitosamente');
                                    setOpen(false);
                                    tableRef.current?.refresh();
                                });
                            }}
                            onCancel={() => { isMounted() && setOpen(false); tableRef.current?.refresh(); }}
                        />


                       <ChangeStateColumn
                            data={data.estado}
                            options={optionsEstadoCites}
                            onChange={async (newValue: any) => {								
                                if(String(newValue)=== ANULADO){									
                                    setOpen2(true);									
                                    setAnulaId({id:data.id, tipo_documento: data.tipo_documento, cite_completo: data.cite_completo,nombre_area_solicitante: data.nombre_area_solicitante});
                                }

                                 if(String(newValue) === CERRADO){                                   
                                    setOpen(true);								
                                    setCierraId({id:data.id, tipo_documento: data.tipo_documento, cite_completo: data.cite_completo,nombre_area_solicitante: data.nombre_area_solicitante});
                                }
                                
                            }}
                        />
                    </>
                );      
     
        }
    

      //cambio de color estado
         function renderColumnStatus(data: CitesTableModel): ReactElement {
             const estado = data.estado;		
             const color = 'white';
             const background = ESTADO_Q[estado];
             const texto = estado;
             return <StatusColumn status={texto} color={color} background={background} />;
         }   

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={onAddClick}
                onDownloadClick={onDownloadClick}
                vScroll
            />
        </>
    );
};

export const CitesTable = forwardRef(CitesTableComponent);
