import React, { ReactElement } from 'react';
/* Material UI */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography/Typography';
import { Grid } from '@mui/material';
import { ReporteValeFormModel } from './ReporteValeFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: ReporteValeFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const ReporteValeDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Reportes Vales de Combustible</Typography>

                        <Grid container spacing={1}>
                        <Grid item xs={12} md={4}><b>Destino:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.destino}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha de Emision:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_emision || new Date() ), FORMAT)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha de Validez:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_validez || new Date() ), FORMAT)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Litros:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.litros}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Distancia:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.distancia}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Observacion:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.observaciones}</Typography></Grid>
                        
                    </Grid>
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
                            <b>Nombre:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                               {/* se cambia nombre por nume_recibo */}
                            <Typography variant="body1" sx={{ mx: 2 }}>{formModel?.destino}</Typography>
                        </Grid>
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

export default ReporteValeDialog;
