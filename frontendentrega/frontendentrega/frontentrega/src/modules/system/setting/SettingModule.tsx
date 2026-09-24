import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { SettingModuleService } from './SettingModuleService';
import { CircularProgress } from '@mui/material';
import { useNotify } from 'services/notify';

export const SettingModule = (): ReactElement => {
    const notify = useNotify();
    const gestionAnterior = new Date().getFullYear() - 1;

    const [loading, setLoading] = useState<string>('');
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0); // 01/01 00:00
        const end = new Date(now.getFullYear(), 0, 1, 23, 59, 59); // 01/01 23:59:59
        const cierreGestion = localStorage.getItem("cierre_gestion");

        if (now >= start && now <= end && cierreGestion !== "true") {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }, []);

    /* function handleClickPersonal() {
        setLoading('personal');
        SettingModuleService.getPersonalData().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    }

    function handleClickCargo() {
        setLoading('cargo');
        SettingModuleService.getCargoData().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    }

    function handleClickArea() {
        setLoading('area');
        SettingModuleService.getAreaData().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    }

    function handleClickAsignar() {
        setLoading('asignar');
        SettingModuleService.getAsignarData().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    }

    function handleClickVacacion() {
        setLoading('vacacion');
        SettingModuleService.getVacacionData().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    } */

    /* function handleClickRevisionHorario() {
        setLoading('revision_horario');
        SettingModuleService.getRevisionHorario().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
        });
    } */

    function handleClickCierreGestion() {
        setLoading('cierre_gestion');
        SettingModuleService.getCierreGestion().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
            setShowButton(false);
            localStorage.setItem("cierre_gestion", "true");
        });
    }

    /* function handleClickUpdateAllPassword() {
        setLoading('update_user_password');
        SettingModuleService.getUserPasswordAll().then((result) => {
            setLoading('');
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
            setShowButton(false);
            localStorage.setItem("update_user_password", "true");
        });
    } */

    return (
        <Box sx={{ m: 3, p: 3 }}>
            <Paper>
                {/* <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickPersonal}
                    color="primary"
                    startIcon={loading==='personal' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='personal'}
                >
                    Cargar Personal
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickArea}
                    color="info"
                    startIcon={loading==='area' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='area'}
                >
                    Cargar Areas
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickCargo}
                    color="secondary"
                    startIcon={loading==='cargo' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='cargo'}
                >
                    Cargar Cargos
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickAsignar}
                    color="warning"
                    startIcon={loading==='asignar' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='asignar'}
                >
                    Cargar Asignar
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickVacacion}
                    color="error"
                    startIcon={loading==='vacacion' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='vacacion'}
                >
                    Cargar Vacacion
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickRevisionHorario}
                    color="error"
                    startIcon={loading==='revision_horario' ? <CircularProgress size={24} />:<ManageHistoryIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='revision_horario'}
                >
                    Revision Horario
                </Button>*/}
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickCierreGestion}
                    color="error"
                    startIcon={loading==='cerrar_gestion' ? <CircularProgress size={24} />:<RestartAltIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='cerrar_gestion' || !showButton}
                >
                    Cierre de Gestion {gestionAnterior}
                </Button>
                {/* <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClickUpdateAllPassword}
                    color="error"
                    startIcon={loading==='update_user_password' ? <CircularProgress size={24} />:<RestartAltIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    disabled={loading==='update_user_password'}
                >
                    Actualizar Contraseñas
                </Button> */}
            </Paper>
        </Box>
    );
};
