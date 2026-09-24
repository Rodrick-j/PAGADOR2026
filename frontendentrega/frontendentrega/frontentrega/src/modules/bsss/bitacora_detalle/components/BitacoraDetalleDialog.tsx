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
import { BitacoraDetalleFormModel } from './BitacoraDetalleFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: BitacoraDetalleFormModel;
};

const BitacoraDetalleDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de BitacoraDetalle</Typography>
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
                        <Grid item xs={12} md={3}>
                            <b>Fecha Salida:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.fecha_salida}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Fecha Retorno:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.fecha_retorno}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Hora Salida:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.hora_salida}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Hora Retorno:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.hora_retorno}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Destino Salida:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.destino_salida}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Destino Llegada:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.destino_llegada}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Kilometros:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">
                                {formModel?.km_salida} / {formModel?.km_llegada} / {formModel?.km_estimados}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Cantidad Personas:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.cantidad_personas}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Estado:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.estado}</Typography>
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

export default BitacoraDetalleDialog;
