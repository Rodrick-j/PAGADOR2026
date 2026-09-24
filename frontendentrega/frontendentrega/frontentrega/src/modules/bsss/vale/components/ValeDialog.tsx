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
import { ValeFormModel } from './ValeFormDialog';
import { format } from 'date-fns';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: ValeFormModel;
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
                            <b>Fecha Emision:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{format( new Date(formModel?.fecha_emision || new Date() ), FORMAT)}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Fecha Validez:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2">{format( new Date(formModel?.fecha_validez || new Date() ), FORMAT)}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <b>Litros:</b>
                        </Grid>
                        <Grid item xs={9} md={9}>
                            <Typography variant="body2" sx={{ pl: 2 }}>{formModel?.litros} L</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <b>Distancia:</b>
                        </Grid>
                        <Grid item xs={9} md={9}>
                            <Typography variant="body2" sx={{ pl: 2 }}>{formModel?.distancia} Km.</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Destinos:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2" component='p'>{formModel?.destinos}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <b>Observaciones:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="body2" component='p'>{formModel?.observaciones}</Typography>
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
