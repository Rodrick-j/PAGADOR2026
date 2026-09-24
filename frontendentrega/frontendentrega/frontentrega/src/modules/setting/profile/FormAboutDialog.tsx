import React, { ReactElement, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material/';
import packageJson from '../../../../package.json';
import SyncIcon from '@mui/icons-material/Sync';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CacheBuster, VersionInfo } from 'CacheBuster';
import { SUPPORT_EMAIL, WEB_CLIENT_URL } from 'config/app-config';
import { useIsMounted } from 'hooks/useIsMounted';
import Logo2 from 'components/Logo2';

const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

type DialogProps = {
    openDialog: boolean;
    handleDialogClose: () => void;
};

const FormAboutDialog = ({ openDialog, handleDialogClose }: DialogProps) => {
    const theme = useTheme();
    const isMounted = useIsMounted();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [updatingVersion, setUpdatingVersion] = useState<boolean>(false);
    const [versionInfo, setVersionInfo] = useState<VersionInfo>();

    useEffect(() => {
        if (!openDialog) return;
        CacheBuster.getVersionInfo().then((vInfo) => {
            if (isMounted()) setVersionInfo(vInfo);
        });
    }, [isMounted, openDialog]);

    const handleUpdateVersionClick = async () => {
        if (updatingVersion) return;
        setUpdatingVersion(true);
        await CacheBuster.updateToLastVersion(true);
    };

    const renderLogo = (): ReactElement => {
        return (
            <Box display="flex" alignItems="center" justifyContent="center">
                <Logo2 disabledLink  sx={{ width: 96, height: 96 }} />
            </Box>
        );
    };

    const renderTitle = (text: string): ReactElement => {
        return (
            <Box>
                <Typography align="center" variant="body2" sx={{ color: '#757575', fontWeight: 'bold' }}>
                    {text}
                </Typography>
            </Box>
        );
    };

    const renderSubtitle = (text: string): ReactElement => {
        return (
            <Typography align="center" variant="body2" sx={{ color: '#757575' }}>
                {text}
            </Typography>
        );
    };

    const renderVersion = (): ReactElement => {
        const version = `Versión ${packageJson.version}`;
        const isLatestVersion = versionInfo ? versionInfo.latestVersion === versionInfo.buildVersion : true;
        return (
            <Typography
                align="center"
                variant="body2"
                sx={{ color: '#757575', display: 'flex', alignItems: 'center' }}
            >
                {version} &nbsp;
                {isLatestVersion ? (
                    <Tooltip title={<Typography>La última versión ya está instalada</Typography>} placement="right">
                        <IconButton size="small">
                            <CheckCircleIcon sx={{ fontSize: '14px', color: '#4caf50' }} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={<Typography>Existe una nueva versión disponible</Typography>} placement="right">
                        <IconButton size="small">
                            <WarningIcon sx={{ fontSize: '14px', color: '#ff9800' }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Typography>
        );
    };

    const renderLink = (url: string, title: string): ReactElement => {
        return (
            <Typography align="center" variant="body2" sx={{ color: '#757575' }} gutterBottom>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {title}
                </a>
            </Typography>
        );
    };

    const renderUpdateButton = (): ReactElement => {
        const isLatestVersion = versionInfo ? versionInfo.latestVersion === versionInfo.buildVersion : true;
        if (isLatestVersion) return <></>;
        return (
            <Button onClick={() => handleUpdateVersionClick()} variant="contained" color="primary">
                <SyncIcon />
                &nbsp; Actualizar a la última versión
            </Button>
        );
    };

    const renderCloseIcon = (): ReactElement => {
        return (
            <IconButton aria-label="close" onClick={handleDialogClose}>
                <CloseIcon />
            </IconButton>
        );
    };

    const renderDialogContent = () => {
        return (
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                [theme.breakpoints.down('xs')]: {
                    minWidth: 'unset',
                },
            }}>
                {renderCloseIcon()}
                <Box my={1} />
                {renderLogo()}
                <Box my={1} />
                {renderTitle(`.:: Plataforma Atención - PAGADOR ::.`)}
                {renderVersion()}
                <Box my={1} />
                {renderTitle('Última actualización')}
                {renderSubtitle(versionInfo ? new Date(versionInfo.date).toLocaleDateString('es-ES', dateOptions) : '')}
                <Box my={1} />
                {renderTitle('Soporte')}
                {renderSubtitle(SUPPORT_EMAIL)}
                <Box my={1} />
                {renderTitle('Web')}
                {renderSubtitle(WEB_CLIENT_URL)}
                <Box my={1} />
                {renderTitle('Creado por')}
                {renderLink('https://oruro.gob.bo', 'G.A.D.OR - A.T.I.')}
                <Box my={1} />
                {renderUpdateButton()}
                <Box my={1} />
            </Box>
        );
    };

    return (
        <div>
            <form noValidate autoComplete="off" encType="multipart/form-data">
                <Dialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    fullScreen={fullScreen}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogContent>{renderDialogContent()}</DialogContent>
                </Dialog>
            </form>
        </div>
    );
};

export default FormAboutDialog;
