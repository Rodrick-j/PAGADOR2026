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
import { AperturaGeneralModuleService } from 'modules/apertura/apertura_general/AperturaGeneralModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_G } from 'constants/colors';
import { OptionsFormModel } from 'modules/Types';
import { CON_PRESUPUESTO, SIN_PRESUPUESTO } from 'constants/enums';

export type AperturaGeneralTableModel = {
    id: string;
    ue                   : number;
    nombre_area          : string;
    sigla_area           : string;
    apertura_programatica: string;
    cod_fte              : number;
    cod_org              : number;

    descripcion_objeto_gasto: string;
    presupuesto_inicial     : number;
    presupuesto_inicial_    : string;
    presupuesto_restante    : number;
    presupuesto_restante_   : string;
    mod_aprobada            : string;
    presupuesto_vigente     : string;
    pagado                  : string;
    saldo_ejecutar          : string;
    estado                  : string;
    sisin                   : string;
    gestion                 : string;
    area_id                 : string;
    tipo_area               : string;
    nombre_area_hijo_id     : string;
    objeto_id               : string;
    estado_activo           : boolean;
   //  activo                         : boolean; //se agrega para control

    // para las columnas especiales
    actions: unknown;
};


export type AperturaGeneralTableRefProps = {
    refresh: (updateParams?: UpdateParams<AperturaGeneralTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<AperturaGeneralTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresAperturaFilter: HeaderFilter = { type: 'text' };
const nombreAperturaHijoFilter: HeaderFilter = { type: 'text' };
const AperturaFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idAperturaGeneral: string) => Promise<void>;
    onEditClick: (idAperturaGeneral: string) => Promise<void>;
};

export const AperturaGeneralTableComponent = (props: Props, ref: React.Ref<AperturaGeneralTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<AperturaGeneralTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<AperturaGeneralTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false,render:renderColumnActions },
        { id: 'nombre_area', label: 'Area Principal', align: 'center', width: 250, filter: nombresAperturaFilter },
        { id: 'nombre_area_hijo_id', label: 'Area Dependiente', align: 'center', width: 250, filter: nombreAperturaHijoFilter },
        { id: 'apertura_programatica', label: 'Apertura Programatica', align: 'center', width: 150, filter: AperturaFilter },
        { id: 'sigla_area', label: 'Sigla', align: 'center', width: 100 },
        { id: 'tipo_area', label: 'Tipo Area', align: 'center', width: 120 },
        { id: 'cod_fte', label: 'Cod. FTE', align: 'left'},
        { id: 'cod_org', label: 'cod. ORG', align: 'left' },
        { id: 'objeto_id', label: 'Objeto', align: 'left',  width: 100 },
        { id: 'descripcion_objeto_gasto', label: 'Descripcion Objeto Gasto', align: 'center', width: 240,filter: AperturaFilter  },
        { id: 'presupuesto_inicial_', label: 'Presupuesto Inicial', align: 'right'},
        { id: 'presupuesto_restante_', label: 'Presupuesto Restante', align: 'right'},
        { id: 'gestion', label: 'Gestion', align: 'left', width: 120 },
        { id: 'mod_aprobada', label: 'Mod. Aprobadas', align: 'right'},//,
        { id: 'presupuesto_vigente', label: 'Presupuesto Vigente', align: 'right'},
        { id: 'pagado', label: 'Pagado', align: 'right'},
        { id: 'saldo_ejecutar', label: 'Saldo a Ejecutar', align: 'right'},
        { id: 'sisin', label: 'SISIN', align: 'center',width: 200 },
        { id: 'estado_activo', label: 'Activo', align: 'left', render: renderColumnActive },
        { id: 'estado', label: 'Estado', align: 'center',width: 150,render:renderColumnStatus},
    ];

    const handleUpdateTable = (params: UpdateParams<AperturaGeneralTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        AperturaGeneralModuleService.getTableAperturaGeneral(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<AperturaGeneralTableModel> = {
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

    function renderColumnActive(data: AperturaGeneralTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado_activo}
                onActiveChange={async (newValue: any) => {
                    return AperturaGeneralModuleService.setActiveAperturaGeneral(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado Apertura General actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }



    function renderColumnActions(data: AperturaGeneralTableModel): ReactElement {
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
                        notify.success('AperturaGeneral eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: AperturaGeneralTableModel): ReactElement {
        const color = 'white';
        const estado = data.presupuesto_restante > 50?CON_PRESUPUESTO:SIN_PRESUPUESTO;//Definir el monto minimo para la muestra de alerta
        const background = estado === CON_PRESUPUESTO? ESTADO_G[0] : ESTADO_G[1];
        return <StatusColumn status={estado} color={color} background={background} />;
    }

   /* function renderColumnPadre(data: AperturaGeneralTableModel): ReactElement {
        const padre = data.apertura_programatica?'SI':'NO';
        return <StatusColumn status={padre} background={BACKGROUND_1}/>;
    }*/

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

export const AperturaGeneralTable = forwardRef(AperturaGeneralTableComponent);
