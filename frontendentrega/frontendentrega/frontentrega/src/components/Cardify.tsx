import React, { ReactElement } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Card, Grid, Stack, Typography } from '@mui/material';
// utils
// components
import Iconify from 'components/Iconify';
import { SxProps, Theme } from '@mui/material/styles';
// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
    //margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(6),
    height: theme.spacing(6),
    justifyContent: 'center',
    marginBottom: theme.spacing(1.5),
    marginRight: theme.spacing(1.5)
}));

// ----------------------------------------------------------------------
type Props = {
    color?: string;
    icon?: string;
    title: string;
    subtitle?: string;
    description?: string;
    description2?: string;
    sx?: SxProps<Theme>;
};


export default function Cardify(props: Props): ReactElement {    
    const { title, subtitle, description,description2, icon, color = 'primary', sx, ...other } = props;
    return (
            <Card
                sx={{
                    py: 1,
                    px: 0.5,
                    borderRadius: 2,
                    height: 120, //Se modifica el tamaño
                    maxWidth: 360,
                    width: '100%',
                    color: (theme: any) => theme.palette[color].darker,
                    bgcolor: (theme: any) => theme.palette[color].lighter,
                    ...sx
                }}
                {...other}
            >
                <Grid container spacing={1}>
                    <Grid item xs={3} md={3} lg={3}>
                        <IconWrapperStyle
                            sx={{
                                color: (theme: any) => theme.palette[color].dark,
                                backgroundImage: (theme: any) => `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`
                            }}
                        >
                            <Iconify icon={icon} width={24} height={24} />
                        </IconWrapperStyle>
                    </Grid> 
                    <Grid item xs={9} md={9} lg={9}>
                        <Stack direction="column">
                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                {title}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.72 }}>
                                {subtitle}
                            </Typography>                            
                        </Stack>
                    </Grid>                   
                </Grid>
                <Typography variant="caption" sx={{ opacity: 0.72 }} paragraph>
                    {description}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.72 }} >
                    {description2}
                </Typography>
            </Card>
        );
};
