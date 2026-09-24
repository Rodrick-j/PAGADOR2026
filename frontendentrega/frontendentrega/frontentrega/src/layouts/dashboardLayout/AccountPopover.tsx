import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, alpha } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import Iconify from '../../components/Iconify';
// mocks_
import { auth } from 'services/auth';
import { useSession } from 'hooks/session';
import { truncateTextLong } from '../../utils/formatText';
import FormAboutDialog from '../../modules/setting/profile/FormAboutDialog';
import FormUploadDialog from '../../modules/setting/profile/FormUploadDialog';
import { ENUM_IS_SUPERADMINISTRADOR } from '../../constants/enums';
import { getAvatarURL } from '../../utils';
import FormChangeDialog from 'modules/setting/profile/FormChangeDialog';

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const navegate = useNavigate();
    const authUser = useSession();
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;

    const [open, setOpen] = useState(null);
    const imagen_avatar = getAvatarURL(authUser?.avatar);
    const [imagen, setImagen] = useState<string>(imagen_avatar);

    const [openDialogAbout, setOpenDialogAbout] = useState(false);
    const [openDialogPerfil, setOpenDialogPerfil] = useState(false);
    const [openDialogChange, setOpenDialogChange] = useState(false);

    const handleOpen = (event: any) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogOut = () => {
        auth.doSignOut().then(() => navegate('/'));
        setOpen(null);
    };

    const handleAboutOpen = () => {
        setOpen(null);
        setOpenDialogAbout(true);
    };

    const handleChangeOpen = () => {
        setOpen(null);
        setOpenDialogChange(true);
    };

    const handlePerfilOpen = () => {
        setOpen(null);
        setOpenDialogPerfil(true);
    };

    const handlePerfilClose = (imagen: string) => {
        setOpenDialogPerfil(!openDialogPerfil);
        if (typeof imagen === 'string') setImagen(imagen);
    };

    const handleAboutClose = () => {
        setOpenDialogAbout(false);
    };

    const handleChangeClose = () => {
        setOpenDialogChange(!openDialogChange);
    };

    return (
        <>
            {openDialogAbout && (
                <FormAboutDialog
                    openDialog={openDialogAbout}
                    handleDialogClose={handleAboutClose}
                />
            )}
            {openDialogPerfil && (
                <FormUploadDialog
                    openDialog={openDialogPerfil}
                    handleDialogClose={handlePerfilClose}
                    imagenPerfil={imagen}
                />
            )}
            {openDialogChange && (
                <FormChangeDialog
                    openDialog={openDialogChange}
                    handleDialogClose={handleChangeClose}
                />
            )}
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={[
                    { p: 0 },
                    open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4)
                        }
                    }
                ]}
            >
                <Avatar src={imagen} alt="photoURL" sx={{ width:  56, height: 56 }} />
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75
                    }
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" sx={{lineHeight: '1'}}>
                        {authUser.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} >
                        {truncateTextLong(authUser.username, 25)}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    <MenuItem onClick={handlePerfilOpen}>
                        <Iconify icon={'ant-design:user-outlined'} sx={{ mr: 1, fontSize: 24 }} />
                        Perfil
                    </MenuItem>
                    <MenuItem onClick={handleChangeOpen}>
                        <Iconify icon={'carbon:password'} sx={{ fontSize: 24 }} />
                        &nbsp;&nbsp;Camb. Contraseña
                    </MenuItem>
                    <MenuItem onClick={handleAboutOpen}>
                        <Iconify icon={'mdi:about-circle-outline'} sx={{ mr: 1, fontSize: 24 }} />
                        Acerca de
                    </MenuItem>
                    {
                        es_super_administrador && <MenuItem key="config" to="/dashboard/setting" component={RouterLink} onClick={handleClose}>
                                                    <Iconify icon="ant-design:setting-twotone" sx={{ mr: 1, fontSize: 24 }} />
                                                    Configuración
                                                </MenuItem>
                    }
                </Stack>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
                    <Iconify icon={'entypo:log-out'} sx={{ mr: 1 }} />
                    Cerrar Sesion
                </MenuItem>
            </MenuPopover>
        </>
    );
}
