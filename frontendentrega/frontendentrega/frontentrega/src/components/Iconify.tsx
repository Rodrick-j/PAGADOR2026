import React from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
// ----------------------------------------------------------------------

interface Props extends React.ComponentPropsWithRef<typeof Box> {
    icon: any | string;
    sx?: SxProps<Theme>;
}

export default function Iconify(props: Props) {
    const { icon, sx, ...rest } = props;
    return <Box component={Icon} icon={icon} sx={{ ...sx }} {...rest} />;
}
