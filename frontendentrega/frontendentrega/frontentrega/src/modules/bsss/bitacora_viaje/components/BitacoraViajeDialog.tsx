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
import { BitacoraViajeFormModel } from './BitacoraViajeFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: BitacoraViajeFormModel;
};

const BitacoraViajeDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de BitacoraViaje</Typography>
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
                            <b>Semana:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.semana}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Area:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.area_id}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Vehiculo:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.vehiculo_id}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Usuario:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.usuario_id}</Typography>
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

export default BitacoraViajeDialog;
