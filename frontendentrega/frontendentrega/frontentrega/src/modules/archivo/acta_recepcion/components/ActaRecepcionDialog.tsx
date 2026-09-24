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
import { ActaRecepcionFormModel } from './ActaRecepcionFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: ActaRecepcionFormModel;
};

const ActaRecepcionDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Acta Recepcion</Typography>
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
                            <b>Acta Recepcion:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.cod_acta}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Documentos:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <table style={{ width: '100%', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                       <th>Nro</th>
                                       <th>Tipo</th>
                                       <th>Nro Folio</th>
                                       <th>Gestion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    formModel?.documentos &&
                                        formModel.documentos.map((a: any, index) => {
                                            const columns = a.nro.split('-');
                                            if(columns.length > 0)
                                                return(
                                                    <tr key={index}>
                                                        {
                                                            columns.map((item: string, index: any) => (
                                                                <td key={index}>{item}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                )
                                        })
                                }
                                </tbody>
                            </table>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Observacion:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.observacion}</Typography>
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

export default ActaRecepcionDialog;
