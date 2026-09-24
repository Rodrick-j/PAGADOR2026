import React, { useState } from 'react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
//
import Iconify from './Iconify';
import { NavConfigType } from 'layouts/dashboardLayout/NavConfig';
// ----------------------------------------------------------------------

const ListItemStyle: any = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius
}));

const ListItemIconStyle = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

// ----------------------------------------------------------------------
type ItemProps = {
    title: string;
    path: string;
    icon: string;
    info: string;
    children: React.ReactNode[];
};

interface ListItemProps {
    item: ItemProps;
    active: (item: string) => boolean;
    minimized: boolean;
}

function NavItem({ item, active }: ListItemProps) {
    const theme = useTheme();
    const { title, path, icon, info, children } = item;
    const isActiveRoot = active(path);
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen((prev: any) => !prev);
    };

    const activeRootStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
    };

    const activeSubStyle = {
        color: 'text.primary',
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        fontWeight: 'fontWeightMedium'
    };

    if (children) {
        return (
            <>
                <ListItemStyle
                    onClick={handleOpen}
                    sx={{
                        ...(isActiveRoot && activeRootStyle)
                    }}
                >
                    <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                    <Iconify
                        icon={open || isActiveRoot ? 'eva:arrow-down-fill' : 'eva:arrow-right-fill'}
                        sx={{ width: 16, height: 16, ml: 1 }}
                    />
                </ListItemStyle>

                <Collapse in={open || isActiveRoot} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            children.map((item: any, index: any) => {
                                const { title, icon, path } = item;
                                const isActiveSub = active(path);

                                return (
                                    <ListItemStyle
                                        key={index}
                                        component={RouterLink}
                                        to={path}
                                        sx={{
                                            ...(isActiveSub && activeSubStyle)
                                        }}
                                    >
                                        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
                                        <ListItemText disableTypography primary={title} />
                                    </ListItemStyle>
                                );
                            })
                        }
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItemStyle
            component={RouterLink}
            to={path}
            sx={{
                ...(isActiveRoot && activeRootStyle)
            }}
        >
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
            <ListItemText disableTypography primary={title} />
            {info && info}
        </ListItemStyle>
    );
}

type NavSectionProps = {
    navConfig: NavConfigType[];
    minimized: boolean;
};

export default function NavSection({ navConfig, minimized, ...other }: NavSectionProps) {
    const { pathname } = useLocation();
    const match = (path: any) => (path ? !!matchPath({ path, end: false }, pathname) : false);
    return (
        <Box {...other}>
            <List disablePadding >
                {navConfig.map((item: any, index: any) => (
                    <NavItem key={index} item={item} active={match} minimized={minimized} />
                ))}
            </List>
        </Box>
    );
}
