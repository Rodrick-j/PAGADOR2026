import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box, CircularProgress, IconButton } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { HistorialAperturaModuleService } from 'modules/apertura/historial_apertura/HistorialAperturaModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_F, ESTADO_G } from 'constants/colors';
import { AperturaGeneralModuleService } from 'modules/apertura/apertura_general';
import { CON_PRESUPUESTO, SIN_PRESUPUESTO } from 'constants/enums';

export type HistorialAperturaTableModel = {
    id: string;
    nombre_area                    : string;
    sigla_area                     : string;
    apertura_programatica          : string;
    cod_fte                        : number;
    cod_org                        : number;
    objeto_id                      : string;
    descripcion_objeto_gasto       : string;
    presupuesto_inicial            : number;
    presupuesto_inicial_           : string;
    presupuesto_restante           : number;
    presupuesto_restante_          : string;
    //mod_aprobada                    : number;
   // presupuesto_vigente             : number;
   // pagado                         : number;
   // saldo_ejecutar                  : number;
    estado                         : string;
    sisin                          : string;
   // gestion                        : string;
    area_id                         : string;
    tipo_area : string;
    nombre_area_hijo_id : string;
    imprimir?                       : string;
    //estado_activo                  : boolean;
   //  activo                         : boolean; //se agrega para control

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type ReporteAperturaGeneralTableModel = {
    id: string;
    ue?                            : number;
    nombre_area?                    : string;
    sigla_area?                     : string;
    apertura_programatica?          : string;
    cod_fte?                        : number;
    cod_org?                        : number;
    objeto_id?                         : string;
    descripcion_objeto_gasto?       : string;
    presupuesto_inicial?            : number;
    presupuesto_restante?           : number;
    mod_aprobada?                    : number;
    presupuesto_vigente?             : number;
    pagado?                         : number;
    saldo_ejecutar?                  : number;
    estado?                         : string;
    sisin?                          : string;
    gestion?                        : string;
    areaId?                         : string;
    estado_activo?                  : boolean;
    //Detalle
    titulo?                        : string;
    descripcion?                   : string;
    gasto?                         : number;
    estado_detalle?                        : string;
    fecha?                         : Date;
    aperturaId?                    : string;
    //gasto
    debe?                 : number;
    haber?                : number;
    saldo?               : number;
};

export type HistorialAperturaTableRefProps = {
    refresh: (updateParams?: UpdateParams<HistorialAperturaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<HistorialAperturaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };


type Props = {
    onAddClick: () => void;
    onViewClick: (idHistorialApertura: string) => Promise<void>;
    onEditClick: (idHistorialApertura: string) => Promise<void>;
    onDetalleClick  : (idHistorialApertura: string) => void;
    onImprimirClick: (data: ReporteAperturaGeneralTableModel) => void;
    loading: string;
};

export const HistorialAperturaTableComponent = (props: Props, ref: React.Ref<HistorialAperturaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick,onDetalleClick, loading, onImprimirClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<HistorialAperturaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<HistorialAperturaTableModel>[] = [
        { id: 'options', label: 'Opciones', sort: false,width: 120, render: renderColumnOptions },
        { id: 'imprimir', label: 'Imprimir Reporte', sort: false,width: 120, render: renderImpresionOptions },
        { id: 'nombre_area', label: 'Area Principal', align: 'center', width: 250, filter: nombresFilter },
        { id: 'nombre_area_hijo_id', label: 'Area Dependencia', align: 'center', width: 250, filter: nombresFilter },
        { id: 'tipo_area', label: 'Tipo Area', align: 'center', width: 120, filter: nombresFilter },
        { id: 'sigla_area', label: 'Sigla', align: 'left', width: 100, filter: nombrePadreFilter },
        { id: 'apertura_programatica', label: 'Apertura Programatica', align: 'center', width: 150, filter: nombrePadreFilter },
        { id: 'estado', label: 'Estado', align: 'center',width: 150,render:renderColumnStatus},
        { id: 'cod_fte', label: 'Cod. FTE', align: 'left'},
        { id: 'cod_org', label: 'cod. ORG', align: 'left'},
        { id: 'objeto_id', label: 'Objeto', align: 'left',  width: 100,filter: nombrePadreFilter },
        { id: 'descripcion_objeto_gasto', label: 'Descripcion Objeto Gasto', align: 'center', width: 240,filter: nombrePadreFilter },
        { id: 'presupuesto_inicial_', label: 'Presupuesto Inicial', align: 'right'},
        { id: 'presupuesto_restante_', label: 'Presupuesto Restante', align: 'right'},
        { id: 'sisin', label: 'SISIN', align: 'center',width: 200},
    ];

    const handleUpdateTable = (params: UpdateParams<HistorialAperturaTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        AperturaGeneralModuleService.getTableAperturaGeneral(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<HistorialAperturaTableModel> = {
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




    function renderColumnActions(data: HistorialAperturaTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/*Se cambia a apertura programatica y Cod fte  <strong>Nombre: </strong> {data.apertura_programatica +' - '+data.cod_fte} deberia ser por el area y apertura programatica*/}
                            <strong>Nombre: </strong> {data.apertura_programatica +' - '+data.descripcion_objeto_gasto}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return AperturaGeneralModuleService.destroyAperturaGeneral(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('HistorialApertura eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: HistorialAperturaTableModel): ReactElement {
        const color = 'white';
        const estado = data.presupuesto_restante > 0?CON_PRESUPUESTO:SIN_PRESUPUESTO;//Definir el monto minimo para la muestra de alerta
        const background = estado === CON_PRESUPUESTO? ESTADO_G[0] : ESTADO_G[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnOptions(data: HistorialAperturaTableModel): ReactElement { //corregir la descarga de pdf
        return (
            <>
                <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                    <ListAltIcon />
                </IconButton>

            </>
        );
    }

    function renderImpresionOptions(data: ReporteAperturaGeneralTableModel): ReactElement {
        return (
            <>
              <IconButton size="small" disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="error">
                  {loading===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
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
              //  onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const HistorialAperturaTable = forwardRef(HistorialAperturaTableComponent);
