import React, { ReactElement } from 'react';

// @mui
import { Button, Box, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

// components
import { DataSearch } from 'components/core/DataSearch';
import { ActionBarProps, TableHeader, MyTableModel } from './Types';
// hooks
import { useSession } from 'hooks/session';
import { TableView, ViewList } from '@mui/icons-material';
import Iconify from 'components/Iconify';

export const ActionBar = ({
    updateParams,
    headers,
    loading,
    loadingE,
    onFilterClick,
    onResfreshClick,
    onSearchClick,
    onSearchTextChange,
    onActionAddClick,
    onDownloadClick,
    onDownloadExcel,
    onActionAnularClick,

}: ActionBarProps): ReactElement => {

    const hasHeaderFilters = headers.filter((column: TableHeader<MyTableModel>) => column.filter).length > 0;
    const theme = useTheme();
    const authUser = useSession();

    const direccion = useMediaQuery(theme.breakpoints.up('sm'));

    const renderAddButton = (): ReactElement => {
        if(authUser.permisos.create)
            return (
                <Button variant="contained" color="secondary" disableElevation onClick={onActionAddClick} size="small" sx={{ mx: 1 }}>
                    <AddIcon />
                    Agregar
                </Button>
            );
        return (<></>);
    };

     const renderAnularButton = (): ReactElement => {
       
            return (
                <Button variant="contained" color="error" disableElevation onClick={onActionAnularClick} size="small" sx={{ mx: 1 }}>
                    <CancelIcon />
                    Anular Recibo
                </Button>
            );
       
    };

    const renderFilterButton = (): ReactElement => {
        return (
            <Button variant="contained" onClick={onFilterClick} disabled={!hasHeaderFilters} disableElevation size="small" sx={{ mx: 1 }}>
                <FilterListIcon />
            </Button>
        );
    };

    const renderResfreshButton = (): ReactElement => {
        return (
            <Button variant="contained" disableElevation onClick={onResfreshClick} size="small" sx={{ mx: 1 }}>
                <RefreshIcon />
            </Button>
        );
    };

    const renderDownloadButton = (): ReactElement => {
        if(authUser.permisos.download)
        return (
            <Button disabled={loading} variant="contained" onClick={onDownloadClick} sx={{ mx: 1, alignSelf: 'center' }} size="small" color="error">
                {loading ? <CircularProgress size={24} style={{ color: 'white' }} />:<PdfIcon />}
            </Button>
        );
        return (<></>);
    };

    const renderDownloadButtonExcel = (): ReactElement => {
        if(authUser.permisos.download)
        return (
            <Button disabled={loadingE} variant="contained" onClick={onDownloadExcel} sx={{ mx: 1, alignSelf: 'center' }} size="small" color="inherit">
                {loadingE ? <CircularProgress size={24} style={{ color: 'white' }} />: <Iconify
                                    icon={'vscode-icons:file-type-excel2'}
                                    sx={{ width: 24, height: 24, ml: 1 }}
                                />}
            </Button>
        );
        return (<></>);
    };

    return (
        <Box
            sx={{
                display: direccion ? 'flex' : 'inline',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                my: 2
            }}
        >
            <Box component="span">
                {onActionAddClick && renderAddButton()}               
                {onFilterClick && renderFilterButton()}
                {onResfreshClick && renderResfreshButton()}
                {onActionAnularClick && renderAnularButton()}
            </Box>
            <Box
                display='flex'
                justifyContent='space-between'
            >
                {onDownloadExcel && renderDownloadButtonExcel()}
                {onDownloadClick && renderDownloadButton()}
                {onSearchClick && <DataSearch updateParams={updateParams} onSearchClick={onSearchClick} onSearchTextChange={onSearchTextChange} />}
            </Box>

        </Box>
    );
};
