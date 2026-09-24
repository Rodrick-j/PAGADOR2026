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
import { DocumentoFormModel } from './DocumentoFormDialog';
import { format } from 'date-fns';
import { fCurrency2 } from 'utils/formatNumber';

type Props = {
    open       : boolean;
    onComplete : () => void;
    formModel ?: DocumentoFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const DocumentoDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Documento</Typography>
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
                        <Grid item xs={12} md={4}>
                            <b>Nro:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1" noWrap>{formModel?.nro}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Tipo de Documento:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.tipo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Descripcion:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.descripcion}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Fecha:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.fecha && format(new Date(formModel?.fecha), FORMAT).toString()}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Hojas de Ruta:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.hojas_ruta}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Monto:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{fCurrency2(formModel?.monto || 0)} Bs.</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Grupo de Gasto:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.grupo_gasto}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Doc Adjunto:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.doc_adjunto}</Typography>
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

export default DocumentoDialog;
