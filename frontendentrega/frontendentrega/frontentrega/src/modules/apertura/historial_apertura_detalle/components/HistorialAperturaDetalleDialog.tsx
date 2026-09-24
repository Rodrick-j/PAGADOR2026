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
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { HistorialAperturaDetalleFormModel } from './HistorialAperturaDetalleFormDialog';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: HistorialAperturaDetalleFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const HistorialAperturaDetalleDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Apertura General</Typography>
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
                            {/* Se agrega lo de apertura programatica */}
                            <Typography variant="body1" sx={{ mx: 2 }}>{formModel?.apertura_programatica}</Typography>  
                        </Grid>
                    </Grid>

                     {/* Tabla */}
                <TableContainer  sx={{ mt: 3 }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>TITULO:</TableCell>
                                <TableCell>{formModel?.titulo}</TableCell>                       
                            </TableRow>
                             <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>DESCRIPCION OBJETO:</TableCell>
                                <TableCell>{formModel?.descripcion_apertura}</TableCell>                       
                            </TableRow>
                             <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>DESCRIPCION:</TableCell>
                                <TableCell>{formModel?.descripcion}</TableCell>                       
                            </TableRow>                            
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>DEBE / HABER:</TableCell>
                                <TableCell>{formModel?.debe_haber}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>SALDO:</TableCell>
                                <TableCell>{formModel?.saldo}</TableCell>                       
                            </TableRow>
                                            
                        </TableBody>                   
                    </Table>
                </TableContainer>


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

export default HistorialAperturaDetalleDialog;
