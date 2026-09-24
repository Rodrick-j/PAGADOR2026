import { ReactElement, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import Iconify from 'components/Iconify';
import { useSession } from 'hooks/session';
import { useIsMounted } from 'hooks/useIsMounted';
import { ConfirmDialog } from './ConfirmDialog';
// component

// ----------------------------------------------------------------------

type Props = {
    deleteMessage?: string | ReactElement;
    onEditClick?: () => Promise<void>;
    onLockOpenClick?: () => Promise<any>;
    onDeleteClick?: () => Promise<any>;
    onViewClick?: () => void;
    onSendClick?: () => void;
    onCommentClick?: () => void;
    onLockOpenMessage?: string | ReactElement;
    size?: 'small' | 'medium';
};

export const MoreMenu = ({ deleteMessage, onEditClick, onLockOpenClick, onDeleteClick, onViewClick, onSendClick, onCommentClick, onLockOpenMessage, size }: Props): ReactElement => {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    
    const authUser = useSession();
    const isMounted = useIsMounted();

    const [loading, setLoading] = useState<boolean>(false);

    const handleEvent = (fn?: () => Promise<void>) => () => {
        setIsOpen(false);
        if (loading) return;
        if (fn) {
            isMounted() && setLoading(true);
            fn()
                .then(() => isMounted() && setLoading(false))
                .catch(() => isMounted() && setLoading(false));
        }
    };

    const renderEditButton = (): ReactElement => {
        if(authUser.permisos.edit)
            return (
                <MenuItem onClick={handleEvent(onEditClick)} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            );
        return (<></>);
    };

    const renderViewButton = (): ReactElement => {
        if(authUser.permisos.read){
            return (
                <MenuItem onClick={() => onViewClick ? (onViewClick(), setIsOpen(false)) : false} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Iconify icon="carbon:view-filled" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Ver" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            );}
        return (<></>);
    };

    const renderCommentButton = (): ReactElement => {
        return (
            <MenuItem onClick={() => (onCommentClick ? onCommentClick() : false)} sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                    <Iconify icon="eva:edit-fill" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Comentar" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
        );
    };

    const renderSendButton = (): ReactElement => {
        if(authUser.permisos.send)
            return (
                <MenuItem onClick={() => (onSendClick ? onSendClick() : false)} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Enviar" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            );
        return (<></>);
    };

    const [open1, setOpen1] = useState<boolean>(false);
    const renderLockOpenButton = (): ReactElement => {
        return (
            <MenuItem onClick={() => isMounted() && setOpen1(!open1)} sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                    <Iconify icon="eva:edit-fill" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Restablecer" primaryTypographyProps={{ variant: 'body2' }} />
                <ConfirmDialog
                    title={'Confirmar'}
                    message={onLockOpenMessage || '¿Quiere reestablecer la contraseña del usuario?'}
                    open={open1}
                    onAccept={async () => {
                        if (onLockOpenClick) return onLockOpenClick().then(() => isMounted() && setOpen1(false));
                    }}
                    onCancel={() => isMounted() && setOpen1(!open1)}
                />
            </MenuItem>
        );
    };

    const [open2, setOpen2] = useState<boolean>(false);
    const renderDeleteButton = (): ReactElement => {
        if(authUser.permisos.remove)
            return (
                <MenuItem onClick={() => isMounted() && setOpen2(!open2)} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" primaryTypographyProps={{ variant: 'body2' }} />
                    <ConfirmDialog
                        title={'Confirmar'}
                        message={deleteMessage || '¿Quiere eliminar el registro?'}
                        open={open2}
                        onAccept={async () => {
                            if (!onDeleteClick) return isMounted() && setOpen2(false);
                            if (onDeleteClick)
                                return onDeleteClick()
                                    .then(() => isMounted() && setOpen2(false))
                                    .catch(() => isMounted() && setOpen2(false));
                        }}
                        onCancel={() => isMounted() && setOpen2(!open2)}
                    />
                </MenuItem>
            );
        return (<div key={"zaqwsx"}></div>);
    };


    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 120, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {onViewClick && renderViewButton()}
                {onEditClick && renderEditButton()}
                {onSendClick && renderSendButton()}
                {onDeleteClick && renderDeleteButton()}
                {onLockOpenClick && renderLockOpenButton()}
                {onCommentClick && renderCommentButton()}
            </Menu>
        </>
    );
}
