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
import { MemorandumFormModel } from './MemorandumFormDialog';

import { format } from 'date-fns';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: MemorandumFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const MemorandumDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Memorandum</Typography>
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
                        <Grid item xs={12} md={4}><b>Memo Nro:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.cod_depart_memo}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha de Registro:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_memo_registro || new Date() ), FORMAT)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Nombre:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.nombre_usuario}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Cargo:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.cargo_usuario}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Tipo Comision:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.tipo_comision_idp}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha de Inicio:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_inicio_viaje || new Date() ), FORMAT)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Fecha de Fin:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{format( new Date(formModel?.fecha_fin_viaje || new Date() ), FORMAT)}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Tipo Transporte:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.tipo_transporte}</Typography></Grid>
                        <Grid item xs={12} md={4}><b>Total Dias:</b></Grid>
                        <Grid item xs={12} md={8}><Typography variant="body1">{formModel?.cantidad_dias}</Typography></Grid>
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

export default MemorandumDialog;
