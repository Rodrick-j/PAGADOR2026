import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn, DataTableV2 } from 'components/core/DataTable';
//@mui
import { Box, Stack, Typography } from '@mui/material';
import { useSession } from 'hooks/session';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { HistorialAperturaDetalleModuleService } from 'modules/apertura/historial_apertura_detalle/HistorialAperturaDetalleModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import Cardify from 'components/Cardify';
import { sanitizeStringToNumber } from 'utils';
import { AperturaGeneralFormModel } from 'modules/apertura/apertura_general/components/AperturaGeneralFormDialog';
import { ENCARGADO_COMBUSTIBLE } from 'constants/enums';

export type HistorialAperturaDetalleTableModel = {

        /*tabla especifica de Apertura viatico*/
        id                            : string;
        titulo                        : string;
        descripcion                   : string;
        gasto                         : number;
        estado                        : string;
        fecha                         : Date;
        fecha_format?                 : string;
        aperturaId                    : string;
        imprimir                      : string;
        debe_haber?                    : string;
        actions                       : unknown;

};



export type HistorialAperturaDetalleTableRefProps = {
    refresh: (updateParams?: UpdateParams<HistorialAperturaDetalleTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<HistorialAperturaDetalleTableModel> = {
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
    onViewClick: (idHistorialAperturaDetalle: string) => Promise<void>;
    onEditClick: (idHistorialAperturaDetalle: string) => Promise<void>;
    onDetalleClick  : (idHistorialAperturaDetalle: string) => void;
    aperturaId :string;
    data: AperturaGeneralFormModel | null;

};

export const HistorialAperturaDetalleTableComponent = (props: Props, ref: React.Ref<HistorialAperturaDetalleTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick,onDetalleClick,aperturaId,data} = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const nombrePadreFilter: HeaderFilter = { type: 'text' };
    const fechaFilter: HeaderFilter = { type: 'date' };
    const authUser = useSession();
    const [tableParams, setTableParams] = useState<UpdateParams<HistorialAperturaDetalleTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<HistorialAperturaDetalleTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false,render:renderColumnActions },//, render: renderColumnActions
        { id: 'titulo', label: 'Concepto de Gasto', sort: false, width: 120, align: 'left' , filter: nombrePadreFilter},
        { id: 'descripcion', label: 'Descripcion Gasto', sort: false, width: '100%', align: 'left',filter: nombrePadreFilter },
        { id: 'gasto', label: 'Monto Gasto', sort: false, width: 120, align: 'left' },
        { id: 'fecha_format', label: 'Fecha', sort: false, width: 120, align: 'left' , filter:fechaFilter},
        { id: 'debe_haber', label: 'Tipo', sort: false, width: 120, align: 'left' },
    ];

      const handleUpdateTable = (params: UpdateParams<HistorialAperturaDetalleTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, apertura_id: aperturaId },
        };
        opt.setLoading(true);
        HistorialAperturaDetalleModuleService.getTableHistorialAperturaDetalle(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<HistorialAperturaDetalleTableModel> = {
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

    function renderColumnActions(data: HistorialAperturaDetalleTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
    }

    return (
        <>
            <Box p={1} pb={0}>
                            {
                                data ?
                                    <Stack direction={"row"} spacing={1} mb={1}>
                                        <Cardify
                                            title={"NOMBRE A.P.: "+data?.apertura_programatica || ""}
                                            subtitle={"OBJETO A.P.: "+data?.objeto_gasto || ""}
                                            description={"DESCRIPCION OBJETO: "+data?.descripcion_objeto_gasto ||  ""}
                                            description2={"SALDO INICIAL: "+sanitizeStringToNumber(data?.presupuesto_inicial || 0.00)+" Bs." || ""}
                                            color={"info"}
                                            icon={"bi:cash-coin"}
                                        />
                                        <Cardify
                                            title={"AREA PRINCIPAL: "+data?.nombre_area || ""}
                                            subtitle={"AREA DEPENDENCIA: "+data?.nombre_area_hijo_id || ""}
                                            description={ "SIGLA AREA: "+data?.sigla_area || ""}
                                            description2={"SALDO RESTANTE: "+sanitizeStringToNumber(data?.presupuesto_restante || 0.00)+" Bs." || ""}
                                            color={"success"}
                                            icon={"majesticons:checkbox-list-detail-line"}
                                        />
                                    </Stack>
                                    :<Typography variant="subtitle1" component="span">Cargando...</Typography>
                            }
            </Box>


            <DataTableV2
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

export const HistorialAperturaDetalleTable = forwardRef(HistorialAperturaDetalleTableComponent);
