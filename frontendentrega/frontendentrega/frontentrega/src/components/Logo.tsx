import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
    disabledLink?: boolean;
    title       ?: string;
    colorText   ?: string;
    isDraw      ?: boolean;
    url         ?: string;
    sx          ?: SxProps<Theme>;
    minimized   ?: boolean;
};

export default function Logo({ disabledLink = false, title = '', url = '/', colorText = 'primary.darker', isDraw = false, minimized = false, sx }: Props) {

    const logo = <Box component="img" src="/static/logo.svg" sx={{ ...sx }} />;

    if (disabledLink) {
        return (
             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {logo}
                {!minimized && title && (
                <Typography variant="h6" color={colorText} sx={{ ml: 1 }}>
                    {title}
                </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box
            component="div"
            sx={[
                isDraw && {
                    justifyContent: 'space-between',
                    display: 'flex'
                }
            ]}
        >
            <RouterLink to={url}>{logo}</RouterLink>
             {
                !minimized && title && (
                                        <Typography
                                            variant="h6"
                                            color={colorText}
                                            textAlign="left"
                                            sx={[
                                                isDraw && {
                                                    width: 160,
                                                    lineHeight: 1.3,
                                                    ml: 1
                                                }
                                            ]}
                                        >
                                            {title}
                                        </Typography>
                )
            }
        </Box>
    );
}
