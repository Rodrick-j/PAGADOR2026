import React, { ReactElement, useState } from 'react';
// @mui
import { Box, Switch } from '@mui/material';
// hooks
import { useSession } from 'hooks/session';

type Props = {
    active: boolean | number | string | null | undefined;
    onActiveChange?: (newValue: boolean) => Promise<any>;
};

export const ActiveColumn = ({ active, onActiveChange }: Props): ReactElement => {

    const authUser = useSession();

    const [loading, setLoading] = useState<boolean>(false);

    const normalizeToBool = (v: Props['active']): boolean => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'number') return v === 1;
        if (v == null) return false;
        const s = String(v).trim().toUpperCase();
        // contempla variantes comunes que aparecen en tablas
        return s === '1' || s === 'TRUE' || s === 'S' || s === 'SI' || s === 'Y' || s === 'YES' || s === 'ACTIVO' || s === 'A';
    };
    const checked = normalizeToBool(active);

    const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setLoading(true);
        if (onActiveChange)
            onActiveChange(newValue)
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
    };
    if(authUser.permisos.approve)
        return (
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Switch checked={checked} onChange={handleClick} disabled={loading} name="checked" inputProps={{ 'aria-label': 'secondary checkbox' }} />
            </Box>
        );
    return <></>
};
