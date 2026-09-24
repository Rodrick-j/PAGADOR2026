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
import { CargoFormModel } from './CargoFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: CargoFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const CargoDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Cargo</Typography>
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
                            <Typography variant="body1">{formModel?.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Numero Item:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.item}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Tipo:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.tipo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Gestion:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.gestion_creacion}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Salario:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.salario}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>libre:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.libre}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Nivel:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body1">{formModel?.nivel}</Typography>
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

export default CargoDialog;
