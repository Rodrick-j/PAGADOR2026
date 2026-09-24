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
import { PersonalFormModel } from './PersonalFormDialog';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

type Props = {
    open: boolean;
    onComplete: () => void;
    formModel?: PersonalFormModel;
};

const FORMAT = 'dd/MM/yyyy';

const PersonalDialog = ({ open, onComplete, formModel }: Props) => {
    const renderDialogTitle = (): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <CalendarMonthIcon color="disabled" sx={{ mr: 2 }} />
                        <Typography noWrap>Detalle de Personal</Typography>
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
                            <b>Nombre:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.nombres}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Apellido Paterno:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.apellido_paterno}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Apellido Materno:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.apellido_materno}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Apellido Casada:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.apellido_casada}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>CI:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.ci} - {formModel?.expedicion}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Sexo:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.sexo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Fecha Nacimiento:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Estado Civil:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.estado_civil}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Profesion:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.profesion}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Telefono:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.telefono}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Direccion:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.direccion}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>AFP:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.afp}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <b>Rentista:</b>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1">{formModel?.rentista?'SI':'NO'}</Typography>
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

export default PersonalDialog;
