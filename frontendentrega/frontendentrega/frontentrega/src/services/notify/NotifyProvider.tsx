import * as React from 'react';
import { useSnackbar } from 'notistack';
import { BaseService } from 'services/base/BaseService';
import { Box, Typography } from '@mui/material';

export type Notify = {
    success: (msg: string, autoHideDuration?: number) => void;
    info: (msg: string, autoHideDuration?: number) => void;
    warning: (msg: string, autoHideDuration?: number) => void;
    error: (msg: string, autoHideDuration?: number) => void;
};

const initialValue: Notify = {
    success: () => ({}),
    info: () => ({}),
    warning: () => ({}),
    error: () => ({})
};

export const NotifyContext = React.createContext<Notify>(initialValue);

type Props = {
    children: React.ReactNode;
};

export const NotifyProvider = ({ children }: Props): React.ReactElement => {
    const { enqueueSnackbar } = useSnackbar();

    const buildMsg = (msg: string) => {
        return (
            <Box display="flex" flexDirection="column" style={{ maxWidth: '500px' }}>
                {msg.split('\n').map((str, index) => {
                    return (
                        <Typography style={{ minHeight: '16px' }} key={index}>
                            {str}
                        </Typography>
                    );
                })}
            </Box>
        );
    };

    const notify: Notify = {
        success: (msg, autoHideDuration = 3000) => {
            enqueueSnackbar(buildMsg(msg), { variant: 'success', autoHideDuration });
        },
        info: (msg, autoHideDuration = 3000) => {
            enqueueSnackbar(buildMsg(msg), { variant: 'info', autoHideDuration });
        },
        warning: (msg, autoHideDuration = 3000) => {
            enqueueSnackbar(buildMsg(msg), { variant: 'warning', autoHideDuration });
        },
        error: (msg, autoHideDuration = 3000) => {
            enqueueSnackbar(buildMsg(msg), { variant: 'error', autoHideDuration });
            BaseService.log(msg);
        }
    };

    return <NotifyContext.Provider value={notify}>{children}</NotifyContext.Provider>;
};
