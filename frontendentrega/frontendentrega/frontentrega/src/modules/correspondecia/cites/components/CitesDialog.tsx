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
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CitesFormModel } from './CitesFormDialog';


type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: CitesFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const CitesDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Cites</Typography>
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
                            <b>CITE:</b>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            {/* Se agrega lo de */}
                            <Typography variant="body1" sx={{ mx: 2 }}>{formModel?.cite_completo}</Typography>  
                        </Grid>
                    </Grid>

            {/* Tabla */}
                <TableContainer  sx={{ mt: 3 }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>FECHA:</TableCell>
                                <TableCell>{formModel?.fecha_registro_format}</TableCell>                       
                            </TableRow>
                             <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>TIPO DOCUMENTO:</TableCell>
                                <TableCell>{formModel?.tipo_documento}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>NOMBRE AREA SOLICITANTE:</TableCell>
                                <TableCell>{formModel?.nombre_origen_string}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>REFERENCIA:</TableCell>
                                <TableCell>{formModel?.referencia}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>DESTINO:</TableCell>
                                <TableCell>{formModel?.nombre_destino_string}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>HOJA DE RUTA:</TableCell>
                                <TableCell>{formModel?.nombre_area_destino}</TableCell>                       
                            </TableRow>
                           <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>DIAS:</TableCell>
                                <TableCell>{formModel?.dias}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>AREA DESTINO:</TableCell>
                                <TableCell>{formModel?.nombre_destino_string}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>USUARIO DESTINO:</TableCell>
                                <TableCell>{formModel?.nombre_usuario_documento}</TableCell>                       
                            </TableRow>
                            <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>USUARIO REGISTRO:</TableCell>
                                <TableCell>{formModel?.nombre_usuario_registro}</TableCell>                       
                            </TableRow> <TableRow>
                                <TableCell  style={{ fontWeight: "bold" }}>FECHA DE CIERRE:</TableCell>
                                <TableCell>{formModel?.fecha_cierre_format}</TableCell>                       
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

export default CitesDialog;
