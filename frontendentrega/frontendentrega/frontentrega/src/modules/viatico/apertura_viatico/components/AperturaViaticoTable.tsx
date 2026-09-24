import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { AperturaViaticoModuleService } from 'modules/viatico/apertura_viatico/AperturaViaticoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_G } from 'constants/colors';
import { CON_PRESUPUESTO, SIN_PRESUPUESTO } from 'constants/enums';

export type AperturaViaticoTableModel = {
    id: string;
    nombre_area                    : string;
    sigla_area                     : string;
    apertura_programatica          : string;
    cod_fte                        : string;
    cod_org                        : string;
    objeto                         : string;
    descripcion_objeto_gasto       : string;
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : string;
    apertura_general_id?          : string | null;
    nombre_area_hijo?              : string;
    sigla_area_hijo?               : string;
    estado_activo?                 : boolean;
  //  activo                         : boolean; //se agrega para control
   //agregar area
    // para las columnas especiales
    actions: unknown;
};


export type AperturaViaticoTableRefProps = {
    refresh: (updateParams?: UpdateParams<AperturaViaticoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<AperturaViaticoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idAperturaViatico: string) => Promise<void>;
    onEditClick: (idAperturaViatico: string) => Promise<void>;
};

export const AperturaViaticoTableComponent = (props: Props, ref: React.Ref<AperturaViaticoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<AperturaViaticoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<AperturaViaticoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false,render:renderColumnActions },//, render: renderColumnActions
        { id: 'estado_activo', label: 'Activo', align: 'left', render: renderColumnActive },
        { id: 'nombre_area', label: 'Nombre del Area', align: 'left', width: 250, filter: nombresFilter },
        { id: 'sigla_area', label: 'Sigla', align: 'left', width: 100, filter: nombrePadreFilter },
         { id: 'nombre_area_hijo', label: 'Nombre del Area hijo', align: 'left', width: 250, filter: nombresFilter },
        { id: 'sigla_area_hijo', label: 'Sigla Area hijo', align: 'left', width: 100, filter: nombrePadreFilter },
        { id: 'gestion', label: 'Gestion', align: 'left', width: 120, filter: nombrePadreFilter },
        { id: 'apertura_programatica', label: 'Apertura Programatica', align: 'center', width: 150, filter: nombrePadreFilter },//, render: renderColumnActive
        { id: 'cod_fte', label: 'Cod. FTE', align: 'left', filter: nombrePadreFilter},
        { id: 'cod_org', label: 'cod. ORG', align: 'left',filter: nombrePadreFilter },
       // { id: 'objeto', label: 'Objeto', align: 'left', width:80 },
        { id: 'descripcion_objeto_gasto', label: 'Descripcion Objeto Gasto', align: 'center', width: 240 },
        { id: 'presupuesto_inicial', label: 'Presupuesto Inicial', align: 'center'},//, render: renderColumnPadre
        { id: 'presupuesto_restante', label: 'Presupuesto Restante', align: 'center'},//, render: renderColumnPadre
        { id: 'sisin', label: 'SISIN', align: 'center',width: 200,filter: nombrePadreFilter },//, render: renderColumnPadre
        { id: 'estado', label: 'Estado', align: 'center',width: 150,render:renderColumnStatus},//, render: renderColumnPadre
      //  { id: 'activo', label: 'Opciones', align: 'left' }//, render: renderColumnStatus
    ];

    const handleUpdateTable = (params: UpdateParams<AperturaViaticoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        AperturaViaticoModuleService.getTableAperturaViatico(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<AperturaViaticoTableModel> = {
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

    function renderColumnActions(data: AperturaViaticoTableModel): ReactElement {
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
                    return AperturaViaticoModuleService.destroyAperturaViatico(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('AperturaViatico eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }
 function renderColumnActive(data: AperturaViaticoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado_activo}
                onActiveChange={async (newValue: any) => {
                    return AperturaViaticoModuleService.setActiveAperturaViatico(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado Apertura General Viatico actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: AperturaViaticoTableModel): ReactElement {
        const color = 'white';
        const estado = data.presupuesto_restante > 0?CON_PRESUPUESTO:SIN_PRESUPUESTO;//Definir el monto minimo para la muestra de alerta
        const background = estado === CON_PRESUPUESTO? ESTADO_G[0] : ESTADO_G[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                //onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const AperturaViaticoTable = forwardRef(AperturaViaticoTableComponent);
