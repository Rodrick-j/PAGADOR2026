import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { useNotify } from 'services/notify';
import { procesoDetalleProps } from '../ProcesoDetalleModule';
import { Box, Stack, Typography } from '@mui/material';
import { ProcesoDetalleModuleService } from '../ProcesoDetalleModuleService';
import { ProcesoFormModel } from 'modules/contra/proceso/components/ProcesoFormDialog';
import { ENUM_SINO } from 'constants/enums';

export type ProcesoDetalleFormModel = {
    id?                     : number;
    notificacion_solicitante: boolean;
    observacion             : string;
    suspension              : boolean;
};

type Props = {
    open: boolean;
    formModel?: any;
    onComplete: () => void;
    procesoDetalleData: procesoDetalleProps | null;
    procesoData: ProcesoFormModel | null;
};

export const ProcesoDetalleFormDialog = ({ open, formModel, onComplete, procesoDetalleData, procesoData }: Props): ReactElement => {
    const notify = useNotify();

    const sinoOptions: SelectOption[] = ENUM_SINO;

    const formLayout: FormGroup<ProcesoDetalleFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'observacion', label: 'Observaciones al proceso', type: 'textarea', rows: 3 }],
                [{ label: 'El campo Observacion es obligatorio, debe ser llenado para la habilitacion del siguiente proceso y envio de notificaciones a los siguientes responsables.', type: 'label'},
                { name: 'suspension', label: 'Marque si existe algun tipo de suspension en el proceso?', type: 'checkbox', inlineDisplay: true }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            observacion             : yup.string().required(),
          //  suspension               : yup.boolean().required(),
           // notificacion_solicitante: yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        
        const result = await ProcesoDetalleModuleService.createOrUpdateProcesoDetalle(formData as unknown as ProcesoDetalleFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete(); 
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: ProcesoDetalleFormModel = {
        observacion             : '',
        notificacion_solicitante: false,
        suspension              : false,
    };

    const newFormModel = formModel && {
        id                      : formModel.id,
        notificacion_solicitante: String(Number(formModel.notificacion_solicitante)),
        observacion             : formModel.observacion,
        suspension              : formModel.suspension,
    };

    function renderHeaderComponent(): ReactElement {
        
        return (
            <Stack direction="column" spacing={1} mb={1}>
                <Box sx={{ minWidth: 240, flexGrow: 1, background: '#00796B', p: 1, borderRadius: 1, color: "white" }}>
                    <Typography variant="subtitle2">
                        {procesoDetalleData?.titulo}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '11px' }}>
                        {procesoDetalleData?.tiempo}
                    </Typography>
                </Box>
                <Box sx={{ minWidth: 240, flexGrow: 1, background: '#1976D2', p: 1, borderRadius: 1, color: "white" }}>
                    <Typography variant="subtitle2">
                        {procesoData?.modalidad_descripcion || ""}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '11px' }}>
                        {procesoData?.cuce || ""}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '11px' }}>
                        {procesoData?.objeto_contratacion || ""}
                    </Typography>
                </Box>
            </Stack>
        );
    }

    return (
        <>
            <FormDialog
                editTitle="Editar Proceso"
                open={open}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={newFormModel || zeroValues}
                formLayout={formLayout}
                validationSchema={validationSchema}
                isEdit={typeof formModel !== 'undefined'}
               // debug
                headerComponent={renderHeaderComponent}
            />
        </>
    );
};

