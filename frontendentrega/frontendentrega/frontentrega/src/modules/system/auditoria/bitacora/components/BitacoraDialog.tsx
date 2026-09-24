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
import { format } from 'date-fns';


export type BitacoraFormModel = {
    id    : string;
    fecha : string;
    ruta  : string;
    metodo: string;
    ip    : string;
    modulo: string;
    nombre: string;
    rol   : string;
}

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: BitacoraFormModel;
};

const FORMAT = 'dd/MM/yyyy HH:mm:ss a';

const ValeDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Vale</Typography>
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
                            <b>Usuario:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Rol:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.rol}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Fecha:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{format( new Date(formModel?.fecha || new Date() ), FORMAT)}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Modulo:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.modulo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Ruta:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.ruta}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Metodo:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.metodo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>IP:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{formModel?.ip}</Typography>
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

export default ValeDialog;
