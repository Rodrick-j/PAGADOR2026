import React, { ReactElement } from 'react';
/* Material UI */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Typography from '@mui/material/Typography/Typography';
import { Grid } from '@mui/material';
import { CuentaFormModel } from './CuentaFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: CuentaFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const CuentaDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Cuenta</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={onComplete}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
        );
    };

    const renderDialogContent = () => {
        return (
            <DialogContent dividers style={{ padding: 0 }}>
                <Box sx={{ flexGrow: 1, m: 2 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <b>Nombre Deudor:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" noWrap>{formModel?.nombre_deudor}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Codigo identidad:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.ci}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Tipo de Cuenta:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.tipo_cuenta}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Saldo real de deuda:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.saldo}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Gestion:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.gestion_generacion_deuda}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Direccion domicilio:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.direccion_domicilio}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Telefono/Celular:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.telefono_celular}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <b>Incremento de Deuda:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.incremento_deuda}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Monto incremento de deuda:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.monto_incremento_deuda}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Depositos realizados:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.depositos_realizados}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Confirmacion:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.confirmacion}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Descripcion Confirmacion:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.descripcion_confirmacion}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <b>Observacion:</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formModel?.observacion}</Typography>
                                </Grid>                                
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>                
            </DialogContent>
        );
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={onComplete} aria-labelledby="form-dialog-title" maxWidth="sm">
                {renderDialogTitle()}
                {renderDialogContent()}
            </Dialog>
        </React.Fragment>
    );
};

export default CuentaDialog;
