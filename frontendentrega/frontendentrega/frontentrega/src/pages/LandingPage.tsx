/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import { Container, Grid, Card, CardContent, Typography, Collapse, Box, IconButton, Divider, InputAdornment, TextField, SvgIcon, Stack, MenuItem } from '@mui/material';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import useResponsive from 'hooks/useResponsive';
import navConfig, { NavConfigType } from 'layouts/dashboardLayout/NavConfig';
import useLocalStorage from 'hooks/localstorage/useLocalStorage';
import Popper from '@mui/material/Popper';

import { format } from 'date-fns';
import es from 'date-fns/locale/es';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalculateIcon from '@mui/icons-material/Calculate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import CommuteIcon from '@mui/icons-material/Commute';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { SxProps } from '@mui/material';
import { useSession } from 'hooks/session';
import { ValeModuleService } from 'modules/bsss/vale';

const FORMAT = 'EEEE, dd MMMM yyyy hh:mm a';

const iconStyle: SxProps = { fontSize: 56, color: '#455A64' };

export const getIconByTitle = (title: string): JSX.Element => {
    switch (title.toLowerCase()) {
        case 'dashboard':
            return <DashboardIcon sx={iconStyle} />;
        case 'rrhh':
            return <GroupsIcon sx={iconStyle} />;
        case 'bienes':
            return <BusinessCenterIcon sx={iconStyle} />;
        case 'conta':
            return <CalculateIcon sx={iconStyle} />;
        case 'contra':
            return <AssignmentIcon sx={iconStyle} />;
        case 'archivo':
            return <FolderIcon sx={iconStyle} />;
        case 'viatico':
            return <CommuteIcon sx={iconStyle} />;
        case 'pasajes':
            return <CommuteIcon sx={iconStyle} />;
        case 'apertura':
            return <SettingsApplicationsIcon sx={iconStyle} />;
        case 'correspondencia':
            return <MarkunreadMailboxIcon sx={iconStyle} />;
        case 'auditoria':
            return <PersonSearchIcon sx={iconStyle} />;
        default:
            return <HelpOutlineIcon sx={iconStyle} />;
    }
};

export default function LandingPage() {
    const authUser = useSession();
    const isMobile = useResponsive('down', 'md');
    const smUp = useResponsive('up', 'sm');

    const [openSection, setOpenSection] = useState<string | null>(null);
    const anchorRefs = useRef<Record<string, HTMLElement | null>>({});
    const [search, setSearch] = useState('');

    const [dashboardGrid] = useLocalStorage<any>('dashboardMenu', []);
    const rutasAuth = dashboardGrid as Array<any>;
    const menuAuth = navConfig(rutasAuth);
    const [filteredMenu, setFilteredMenu] = useState(menuAuth);
    const popperWidths = useRef<Record<string, number>>({});

    const handleToggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
    };

    const filtrarSecciones = (query: string) => {
        if (!query.trim()) return menuAuth;

        const lowerQuery = query.toLowerCase();

        return menuAuth
                .map((section): NavConfigType | null => {
                    const matchSection =
                    section.title?.toLowerCase().includes(lowerQuery) ||
                    section.descripcion?.toLowerCase().includes(lowerQuery);

                    const filteredChildren = section.children?.filter(
                    (child: any) =>
                        child.title?.toLowerCase().includes(lowerQuery) ||
                        child.descripcion?.toLowerCase().includes(lowerQuery)
                    );

                    if (matchSection || (filteredChildren && filteredChildren.length > 0)) {
                    return {
                        ...section,
                        children: filteredChildren || []
                    };
                    }

                    return null;
                })
                .filter((section): section is NavConfigType => section !== null);
    };

    useEffect(() => {
        setFilteredMenu(filtrarSecciones(search));
    }, [search, menuAuth]);

    const generoMasculino = authUser.genero === 'MASCULINO';
    const bienvenidoText = generoMasculino ? 'Bienvenido' : 'Bienvenida';
    const fechaActual = format(new Date(), FORMAT,{ locale: es }).toString();

    const [valeCombustible, setValeCombustible] = useState<string | null>(localStorage.getItem('valeCombustibleHabilitado'));
    const MODULOS = authUser.modulos.find((a:any) => a.name==='vale');
    const is_vale = (MODULOS && typeof MODULOS === 'object') || false;

    useEffect(() => {
        const fetchData = async () => {
            const vehiculoAperturaResponse = await ValeModuleService.getEstadoVale();
            console.log("🚀 ~ fetchData ~ vehiculoAperturaResponse:", vehiculoAperturaResponse)
            if (vehiculoAperturaResponse.success) {
                localStorage.setItem('valeCombustibleHabilitado',vehiculoAperturaResponse.data.estado);
                localStorage.setItem('valeCombustiblePresupuesto',vehiculoAperturaResponse.data.estado_presupuesto);
                setValeCombustible(vehiculoAperturaResponse.data.estado);
            }
        };

        if (!valeCombustible && is_vale) {
            fetchData();
        }
    }, [valeCombustible]);

    return (
        <Container maxWidth="lg" sx={{ mt: 1 }}>
            <Box
                sx={{
                    ...(smUp && { display: 'flex', justifyContent:'space-between' })
                }}
            >
                <Typography variant="h4">Hola, {bienvenidoText}</Typography>
                <Typography variant="caption">{fechaActual}</Typography>
            </Box>
            <Box sx={{  mb: 3 }} maxWidth="sm" margin="0 auto">
                <img src="/static/images/logo3.png" alt="gador-logo" style={{ maxWidth: isMobile ? 100 : 150, marginBottom: 16, marginLeft: 'auto', marginRight: 'auto' }} />
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton onClick={() => setFilteredMenu(filtrarSecciones(search))}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredMenu.map((section: any, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ position: 'relative' }}>
                            <Card
                                sx={{ border: '2px solid #455A64', borderRadius: 2, backgroundColor: '#fff', boxShadow: 5 }}
                                ref={(el) => {
                                    if (el) {
                                        anchorRefs.current[section.info] = el;
                                        popperWidths.current[section.info] = el.getBoundingClientRect().width;
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', px: 2, py: 3 }}>
                                    <Box sx={{ mr: 2 }}>{getIconByTitle(section.info)}</Box>
                                    <CardContent sx={{ flex: 1, p: 0 }}>
                                        <Typography variant="subtitle1" fontWeight={600} color="#455A64">
                                            {section.title}
                                        </Typography>
                                        <Typography variant="subtitle2"  color="#455A64">
                                            {section.title}
                                        </Typography>
                                    </CardContent>
                                    {section.children && section.children.length > 0 && (
                                        <Box>
                                            <IconButton
                                                onClick={() => handleToggle(section.info)}
                                            >
                                                {openSection === section.info ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                {openSection  === section.info && (
                                    <Popper
                                        open
                                        anchorEl={anchorRefs.current[section.info]}
                                        placement="bottom"
                                        modifiers={[{ name: 'preventOverflow', options: { altAxis: true, tether: true, rootBoundary: 'viewport' } }]}
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: '#fff',
                                                border: '1px solid #607D8B',
                                                borderRadius: 1,
                                                boxShadow: 5,
                                                maxHeight: 300,
                                                overflowY: 'auto',
                                                width: popperWidths.current[section.info] || 'auto',
                                                zIndex: 20
                                            }}
                                        >
                                            <Box>
                                                {section.children?.map((item: any, idx: number) => (
                                                <Stack
                                                    key={idx}
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        mb: 1,
                                                        mt: 1,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <MenuItem to={item.path} component={RouterLink} sx={{ width: '100%', p: 0 }}>
                                                        <Box sx={{ pl: 2 }}>
                                                            {cloneElement(item.icon, { sx: { width: 56, height: 56 } })}
                                                        </Box>
                                                        <Box sx={{ ml: 2 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant="subtitle2" color="#455A64">
                                                                {item.descripcion}
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                </Stack>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Popper>
                                )}
                            </Card>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
