import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import { NotifyProvider } from './NotifyProvider';
import { IconButton } from '@mui/material';

type Props = {
    children: React.ReactNode;
};

export const NotistackProvider = ({ children }: Props): React.ReactElement => {
    const notistackRef = React.createRef<SnackbarProvider>();

    const onClickDismiss = (key: string | number) => () => {
        notistackRef.current?.closeSnackbar(key);
    };

    const action = (key: string | number) => {
        return (
            <IconButton onClick={onClickDismiss(key)} style={{ color: 'white' }}>
                <CloseIcon />
            </IconButton>
        );
    };

    return (
        <SnackbarProvider
            ref={notistackRef}
            maxSnack={3}
            // preventDuplicate
            hideIconVariant={true}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            action={action}
        >
            <NotifyProvider>{children}</NotifyProvider>
        </SnackbarProvider>
    );
};
