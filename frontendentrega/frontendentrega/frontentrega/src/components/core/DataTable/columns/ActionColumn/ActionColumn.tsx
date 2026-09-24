import React, { ReactElement, useState } from 'react';
/* @mui */
import Tooltip from '@mui/material/Tooltip';
import { useTheme, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
/* hooks */
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';

import { ConfirmDialog } from 'components/core/ConfirmDialog';

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

export const ActionColumn = ({ deleteMessage, onEditClick, onLockOpenClick, onDeleteClick, onViewClick, onSendClick, onCommentClick, onLockOpenMessage, size }: Props): ReactElement => {
    const theme = useTheme();
    
    const authUser = useSession();
    const isMounted = useIsMounted();

    const [loading, setLoading] = useState<boolean>(false);

    const handleEvent = (fn?: () => Promise<void>) => () => {
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
                <Tooltip title="Editar">
                    <IconButton color="primary" aria-label="edit" component="span" disabled={loading} onClick={handleEvent(onEditClick)} size={size}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            );
        return (<></>);
    };

    const renderViewButton = (): ReactElement => {
        if(authUser.permisos.read)
            return (
                <Tooltip title="Ver">
                    <IconButton color="primary" aria-label="edit" component="span" onClick={() => (onViewClick ? onViewClick() : false)} size={size}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            );
        return (<></>);
    };

    const renderCommentButton = (): ReactElement => {
        return (
            <IconButton color="default" aria-label="comment" component="span" onClick={() => (onCommentClick ? onCommentClick() : false)} size={size}>
                <CommentIcon />
            </IconButton>
        );
    };

    const renderSendButton = (): ReactElement => {
        if(authUser.permisos.send)
            return (
                <Tooltip title="Enviar">
                    <IconButton color="primary" aria-label="edit" component="span" onClick={() => (onSendClick ? onSendClick() : false)} size={size}>
                        <SendIcon />
                    </IconButton>
                </Tooltip>
            );
        return (<></>);
    };

    const [open1, setOpen1] = useState<boolean>(false);
    const renderLockOpenButton = (): ReactElement => {
        return (
            <>
                <ConfirmDialog
                    title={'Confirmar'}
                    message={onLockOpenMessage || '¿Quiere reestablecer la contraseña del usuario?'}
                    open={open1}
                    onAccept={async () => {
                        if (onLockOpenClick) return onLockOpenClick().then(() => isMounted() && setOpen1(false));
                    }}
                    onCancel={() => isMounted() && setOpen1(false)}
                />
                <Tooltip title="Reset">
                    <IconButton color="primary" aria-label="lockOpen" component="span" onClick={() => isMounted() && setOpen1(true)} size={size}>
                        <LockOpenIcon />
                    </IconButton>
                </Tooltip>
            </>
        );
    };

    const [open2, setOpen2] = useState<boolean>(false);
    const renderDeleteButton = (): ReactElement => {
        if(authUser.permisos.remove)
            return (
                <>
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
                        onCancel={() => isMounted() && setOpen2(false)}
                    />
                    <Tooltip title="Borrar">
                        <IconButton color="primary" aria-label="lockOpen" component="span" onClick={() => setOpen2(true)} size={size}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            );
        return (<></>);
    };

    return (
        <div
            style={{
                padding: theme.spacing(0, 1),
                margin: theme.spacing(0, 2),
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            {onViewClick && renderViewButton()}
            {onEditClick && renderEditButton()}
            {onSendClick && renderSendButton()}
            {onDeleteClick && renderDeleteButton()}
            {onLockOpenClick && renderLockOpenButton()}
            {onCommentClick && renderCommentButton()}
        </div>
    );
};
