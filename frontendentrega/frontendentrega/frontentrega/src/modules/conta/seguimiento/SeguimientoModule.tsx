import React, { ReactElement, useState, useRef } from 'react';
// @mui
import { Paper } from '@mui/material';

// components
import { SeguimientoTableRefProps, SeguimientoTable  } from './components/SeguimientoTable';
import { SectionItem, SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
//services
import { SeguimientoModuleService } from './SeguimientoModuleService';
//hook
import { useNotify } from 'services/notify';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';

import { RUTAS } from 'constants/routes';
import { SectionNav } from 'components/core/SectionNav';
import { ENUM_TIPO_CUENTA } from 'constants/enums';
import { SeguimientoTableModel } from './components/SeguimientoTable';
import { SeguimientoFormDialog, SeguimientoFormModel } from './components/SeguimientoFormDialog';

export const SeguimientoModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const navigate = useNavigate();
    const params = useParams();

    const navRef = useRef<SectionNavRefProps>(null);

    const ID_CUENTA = params.id || '';

    const [loading, setLoading] = React.useState(false);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formModel, setFormModel] = useState<SeguimientoFormModel>();

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_cuenta: string) => {
        const actividadFormResponse = await SeguimientoModuleService.getSeguimientoFormData(id_cuenta);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickDownload = async (id_cuenta?: string) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return SeguimientoModuleService.getReportPDF(tableRef.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };

    const tableRef = useRef<SeguimientoTableRefProps>(null);

    return (
        <>
            <SeguimientoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
                cuentaId={ID_CUENTA}
            />
            <SeguimientoTable
                ref={tableRef}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onDownloadClick={handleClickDownload}
                cuentaId={ID_CUENTA}
                loading={loading}
            />
        </>
    );
};
