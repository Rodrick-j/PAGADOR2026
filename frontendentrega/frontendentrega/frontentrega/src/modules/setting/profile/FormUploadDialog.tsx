import React, { ReactElement, useState } from 'react';

/* Material UI */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
/* component */
import { useNotify } from 'services/notify';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProfileModuleService } from './ProfileModuleService';

type DialogProps = {
    openDialog: boolean;
    imagenPerfil: string;
    handleDialogClose: (imagen:string) => void;
};

const FormUploadDialog = ({ openDialog, handleDialogClose, imagenPerfil }: DialogProps) => {
    const [imagen, setImagen] = useState<string>(imagenPerfil);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const notify = useNotify();

    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        if (!event.target.files) return;

        const fileItem = event.target.files[0];
        if (!fileItem) return;

        setIsLoading(true);
        ProfileModuleService.setAvatarUser(fileItem).then(result => {
            if (!result.success) return notify.error(result.msg);
            const newAvatarURL = String(result.data?.avatarUrl);
            setImagen(newAvatarURL);
            const authUserStr = localStorage.getItem('auth');
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                authUser.imagen = newAvatarURL;
                authUser.avatar = String(result.data?.name);
                localStorage.setItem('auth', JSON.stringify(authUser));
            }
            setIsLoading(false);
            return notify.success(result.msg);
        });
    };

    const renderDialogTitle = (title: string): ReactElement => {
        return (
            <DialogTitle id="form-dialog-title">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box alignItems="center" display="flex" overflow="hidden">
                        <Typography noWrap>{title}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => handleDialogClose(imagen)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
        );
    };

    return (
        <div>
            <form noValidate autoComplete="off" encType="multipart/form-data">
                <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                    {renderDialogTitle('Imágen de perfil')}
                    <DialogContent dividers>
                        <Box display="flex" alignItems="center" justifyContent="center">
                        {
                            isLoading?<CircularProgress color="inherit" />
                                    :<Avatar alt="Imágen del perfil de usuario" src={imagen} sx={{ width: 120, height: 120 }}/>
                        }
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around'
                                    }}
                    >
                        <input
                            accept="image/*"
                            id="contained-button-file"
                            onChange={(e) => handleCapture(e)}
                            type="file"
                        />
                        <br/>
                        <Button variant='contained' onClick={() => handleDialogClose(imagen)} disabled={!!isLoading}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
};


export default FormUploadDialog;
