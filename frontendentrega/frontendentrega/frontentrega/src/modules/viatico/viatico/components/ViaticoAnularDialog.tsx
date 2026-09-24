import React, { ReactElement, useEffect, useState } from 'react';

/* Material UI */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Typography from '@mui/material/Typography';
import { Grid, TextField, Button } from '@mui/material';

import { useNotify } from 'services/notify';

import { ViaticoAnularFormModel } from './ViaticoFormDialog';
import { ViaticoModuleService } from '../ViaticoModuleService';

type Props = {
    open: boolean;
    formModel?: ViaticoAnularFormModel;
    onComplete: () => void;
    onCancel: () => void;
};

const ViaticoAnularDialog = ({
    open,
    onComplete,
    onCancel,
    formModel
}: Props): ReactElement => {
    const notify = useNotify();

    const [formValues, setFormValues] = useState<ViaticoAnularFormModel>({
        id_viatico: '',
        nume_recibo: 0,
        fecha_anulacion: new Date(),
        observacion_anulacion: ''
    });

    useEffect(() => {
        if (open) {
            setFormValues({
                id_viatico: formModel?.id_viatico || '',
                nume_recibo: formModel?.nume_recibo || 0,
                fecha_anulacion: formModel?.fecha_anulacion || new Date(),
                observacion_anulacion: formModel?.observacion_anulacion || ''
            });
        }
    }, [open, formModel]);

    const handleChange = (field: keyof ViaticoAnularFormModel, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: field === 'fecha_anulacion' ? new Date(value) : value
        }));
    };

    const handleSubmit = async () => {
        if (!formValues.fecha_anulacion) {
            notify.error('La fecha de anulación es obligatoria');
            return;
        }

        if (!formValues.observacion_anulacion?.trim()) {
            notify.error('La observación es obligatoria');
            return;
        }

        const payload = {
            ...formValues,
         /*   fecha_anulacion:
                formValues.fecha_anulacion instanceof Date
                    ? formValues.fecha_anulacion.toISOString().substring(0, 10)
                    : formValues.fecha_anulacion*/
        };

        const response = await ViaticoModuleService.anularRecibo(payload);

        if (!response.success) {
            notify.error(response.msg || 'No se pudo anular el recibo');
            return;
        }

        notify.success('Recibo anulado correctamente');
        onComplete();
    };

    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Anular Recibo de Viático</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={onCancel}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
        );
    };

    const renderDialogContent = (): ReactElement => {
        return (
            <DialogContent dividers>
                <Box sx={{ flexGrow: 1, m: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <b>Número de Recibo:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                size="small"
                                value={formValues.nume_recibo}
                                onChange={(e) => handleChange('nume_recibo', e.target.value)}
                                //disabled
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <b>Fecha de Anulación:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                value={
                                    formValues.fecha_anulacion
                                        ? new Date(formValues.fecha_anulacion).toISOString().substring(0, 10)
                                        : ''
                                }
                                onChange={(e) => handleChange('fecha_anulacion', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <b>Observación:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                size="small"
                                multiline
                                minRows={4}
                                value={formValues.observacion_anulacion || ''}
                                onChange={(e) => handleChange('observacion_anulacion', e.target.value)}
                                placeholder="Ingrese la razon de la anulación"
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                        <Button variant="outlined" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="warning" onClick={handleSubmit}>
                            Anular Recibo
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            {renderDialogTitle()}
            {renderDialogContent()}
        </Dialog>
    );
};

export default ViaticoAnularDialog;