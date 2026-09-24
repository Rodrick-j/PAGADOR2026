import React, { ReactElement, useState } from 'react';
import { Box, Card, CardContent, IconButton, Typography, useTheme } from '@mui/material';
import { UsuarioTableModel } from './UserTable';
import EditIcon from '@mui/icons-material/Edit';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import { UsersModuleService } from '../UsersModuleService';
import { useNotify } from 'services/notify';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
type Props = {
    data: UsuarioTableModel;
    refresh: () => void;
    onEditClick?: () => void;
    onLockOpenClick?: () => void;
    onDeleteClick?: () => void;
};

export const UserTableItem = ({ data, refresh, onEditClick, onLockOpenClick, onDeleteClick }: Props): ReactElement => {
    const notify = useNotify();
    const theme = useTheme();

    function renderColumnStatus(data: UsuarioTableModel): ReactElement {
        const color = data.estado === 'ACTIVO' ? 'white' : 'inherit';
        const background = data.estado === 'ACTIVO' ? '#74B220' : 'white';
        return (
            <Box
                sx={{
                    padding: theme.spacing(0.5),
                    borderRadius: theme.spacing(2),
                    cursor: 'pointer',
                    color,
                    background,
                    fontSize: '0.75rem',
                    py: 0.5
                }}
                onClick={() => {
                    const newValue = !data.activo;
                    UsersModuleService.setActiveUser(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        refresh();
                    });
                }}
            >
                {data.estado}
            </Box>
        );
    }

    const renderEditButton = () => {
        return (
            <IconButton color="primary" component="span" size="small" onClick={() => (onEditClick ? onEditClick() : false)}>
                <EditIcon />
            </IconButton>
        );
    };

    const [open1, setOpen1] = useState<boolean>(false);
    const renderResetPasswordButton = () => {
        return (
            <>
                <ConfirmDialog
                    title={'Confirmar'}
                    message={
                        <div>
                            <div>¿Quiere reestablecer la contraseña del usuario?</div>
                            <br />
                            <div>
                                <strong>Nombre: </strong> {data.nombre}
                            </div>
                            <br />
                            <div>
                                La nueva contraseña será enviada al correo electrónico <strong>{data.email}</strong>.
                            </div>
                        </div>
                    }
                    open={open1}
                    onAccept={async () => {
                        setOpen1(false);
                        if (onLockOpenClick) return onLockOpenClick();
                    }}
                    onCancel={() => setOpen1(false)}
                />
                <IconButton color="primary" component="span" size="small" onClick={() => setOpen1(true)}>
                    <LockOpenIcon />
                </IconButton>
            </>
        );
    };

    const [open2, setOpen2] = useState<boolean>(false);
    const renderDeleteButton = () => {
        return (
            <>
                <ConfirmDialog
                    title={'Confirmar'}
                    message={
                        <div>
                            <div>¿Quiere eliminar el registro?</div>
                            <br />
                            <div>
                                <strong>Nombre: </strong> {data.nombre}
                            </div>
                        </div>
                    }
                    open={open2}
                    onAccept={async () => {
                        setOpen2(false);
                        if (onDeleteClick) return onDeleteClick();
                    }}
                    onCancel={() => setOpen2(false)}
                />
                <IconButton color="primary" component="span" size="small" onClick={() => setOpen2(true)}>
                    <DeleteIcon />
                </IconButton>
            </>
        );
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Box>
                    <Typography variant="body1" display="block">
                        {data.nombre}
                    </Typography>
                    <Typography variant="caption" display="block">
                        {data.email}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>{renderColumnStatus(data)}</Box>
                    <Box />
                    <Box display="flex">
                        {renderEditButton()}
                        {renderResetPasswordButton()}
                        {renderDeleteButton()}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
