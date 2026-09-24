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
import { DetalleDestinoFormModel } from './DetalleDestinoFormDialog';
import { format } from 'date-fns';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: DetalleDestinoFormModel;
};

const FORMAT_DAY = 'dd/MM/yyyy';
const FORMAT_HORA = 'HH:mm:ss';

const DetalleDestinoDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Destino</Typography>
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
                        <Grid item xs={12} md={4}><b>Destino:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.destino_reg}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Tipo Vehiculo:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.tipo_vehiculo_op}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_dia || new Date() ), FORMAT_DAY)}</Typography></Grid>
                       {/* <Grid item xs={12} md={4}><b>Hora Inicio:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.hora_inicio || new Date() ), FORMAT_HORA)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Hora Fin:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.hora_fin || new Date() ), FORMAT_HORA)}</Typography></Grid>  */}
                        <Grid item xs={12} md={4}><b>Pernocte:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.pernocte}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Objeto de Viaje:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.objetivo_viaje}</Typography></Grid>
                    </Grid>
                </Box>
            </DialogContent>
        );
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={onComplete} aria-labelledby="form-dialog-title" maxWidth="md">
                {renderDialogTitle()}
                {renderDialogContent()}
            </Dialog>
        </React.Fragment>
    );
};

export default DetalleDestinoDialog;
