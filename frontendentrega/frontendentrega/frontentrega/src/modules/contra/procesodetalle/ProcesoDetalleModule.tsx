import React, { ReactElement, useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import es from 'date-fns/locale/es';
// @mui
import AddCommentIcon from '@mui/icons-material/AddComment';
// components
//services
import { useNotify } from 'services/notify';
import {useParams} from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';

import { ProcesoModuleService } from '../proceso';
import { ProcesoFormModel } from '../proceso/components/ProcesoFormDialog';
import { Box, Grid, IconButton, Paper, Skeleton, Stack, Typography, styled } from '@mui/material';

import Scrollbar from 'components/Scrollbar';
import { ENUM_IS_SUPERADMINISTRADOR } from 'constants/enums';
import ProcesoTimeline from 'modules/contra/procesodetalle/components/ProcesoTimeline';
import { ESTADO_C, ESTADO_D } from 'constants/colors';
import { ProcesoDetalleFormDialog } from './components/ProcesoDetalleFormDialog';
import { ActividadModuleService } from '../actividad';
import { ActividadFormModel } from '../actividad/components/ActividadFormDialog';

import { useSession } from 'hooks/session';
import Iconify from 'components/Iconify';
import { getAvatarURL } from 'utils';

export type procesoDetalleProps = {
    id?: string;
    titulo                  : string;
    subtitulo               : string;
    descripcion             : string;
    tiempo                  : string;
    notificacion            : boolean;
    notificacion_solicitante: boolean;
    observacion             : string;
    fecha                   : string;
    fecha_limite            : string;
    type                    : string;
    fecha_envio             : string;
    imagen                  : string;
    estado                  : string;
    usuario_solicitante_id ?: string;
    usuario_solicitante2_id?: string;
    usuario_solicitante3_id?: string;
    hoja_ruta?              : string;
    estado_activo?          : string;

    usuario_id  : string;
    proceso_id  : string;
    usuario_habilitado?     : string;
    usuario_TC_id ?: string;
    usuario_RPARPC_id ?: string;
    usuario_TES_id?: string;
    usuario_TJ_id?: string;
}

type newItemProps = {
    props:{
        title: string;
        description: string;
        image: string;
        place: string;
        color: boolean;
        notificacion: boolean;
    }
};

const FORMAT = 'dd/MM/yyyy HH:mm';

export const ProcesoDetalleModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const authUser = useSession();
    const isMounted = useIsMounted();

    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR
    const ID_USUARIO = authUser.id_usuario;

    const ID_PROCESO = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formOpen2, setFormOpen2] = useState<boolean>(false);
    const [procesoDetalleId, setprocesoDetalleId] = useState<string>('');

    const [procesoData, setProcesoData] = useState<ProcesoFormModel>();
    const [procesoDetalleData, setProcesoDetalleData] = useState<procesoDetalleProps | null>();

    const [tableParams, setTableParams] = useState<procesoDetalleProps[]>();
    const [formModel, setFormModel] = useState<ActividadFormModel>();

    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            setIsloading(true);

            const procesoFormResponse = await ProcesoModuleService.getProcesoFormData(ID_PROCESO);
            if (!procesoFormResponse.success) return notify.error(procesoFormResponse.msg);

            //responsables


            const newFormModel: ProcesoFormModel | null = procesoFormResponse.data || null;
            ProcesoModuleService.getTableProcesoDetalle(ID_PROCESO).then((result: any) => {

                setIsloading(false);
                if (!result || !result.success) return;
                const procesoDetalleRow: procesoDetalleProps[] = result.rows;
                const procesodetalle = procesoDetalleRow && procesoDetalleRow.find((r) => r.notificacion) || null;

                setProcesoDetalleData(procesodetalle);
                setprocesoDetalleId(procesodetalle?.id || '');


                setTableParams(result.rows || []);
            });

            if (isMounted()) {
                if (newFormModel !== null)
                    setProcesoData(newFormModel);
            }
        };
        if(ID_PROCESO) fetchData();
    }, [ID_PROCESO, formOpen2]);

    const handleClickEdit = async (id_actividad: string) => {

        const actividadFormResponse = await ActividadModuleService.getActividadFormData(id_actividad);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    function ProcesoDetalleItem({ props }: newItemProps) {
        const { image, title, description, place, color, notificacion } = props;
        const textoConSaltos = place.split('\n').map((linea, index) => (
            <span key={index}>
                {linea}
                <br />
            </span>
        ));



        return (
            <Paper
                variant='elevation'  //Cambiar el color
                elevation={4}
                sx={{ px: 2, py: 1, background: color?'#FFF3E0':procesoDetalleData?.estado === "SUSPENDIDO"?'#d1d1d1':'white',
                     display: 'flex', justifyContent: 'space-between' }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{background: 'primary'}}
                >
                    <Box
                        component="img"
                        alt={title}
                        src={getAvatarURL(image)}
                        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
                    />

                    <Box sx={{ minWidth: 240, flexGrow: 1 ,  width: '10%'}}>
                        <Typography color="inherit" variant="subtitle2">
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                            {description}
                        </Typography>
                        <Typography variant="caption" component='p' sx={{ color: 'text.secondary', fontSize: '10px' }}>
                            {textoConSaltos}
                        </Typography>
                    </Box>
                </Stack>
                {
                    notificacion && <Box
                                        sx={{
                                            color: "#E65100"
                                        }}
                                    >
                                        <Iconify icon={"carbon:notification-new"} width={24} height={24} />
                                    </Box>
                }
            </Paper>
        );
    }

    return (
        <>
            <ProcesoDetalleFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    setFormOpen2(true);
                }}
                procesoDetalleData={procesoDetalleData || null}
                procesoData={procesoData || null}
            />

            <Box mt={4}>
                <Paper elevation={3} sx={{backgroundColor: "#F4F6F8"}}>
                    <Grid container >
                        <Grid item xs={12} sm={6} md={6}>
                            <Box
                                sx={{
                                    minWidth: 240,
                                    minHeight: 90,
                                    flexGrow: 1,
                                    background: '#303F9F',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: '4px' ,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderTopRightRadius: 0,
                                }}
                            >
                                <Typography color="inherit" variant="subtitle1" noWrap>
                                    {procesoData?.objeto_contratacion || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"FECHA DE INICIO DE PROCESO: "}</strong>
                                    {format ( new Date(procesoData?.fecha_registro || new Date() ), FORMAT)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"C.U.C.E.: "}</strong>
                                    {procesoData?.cuce || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"RESPONSABLE DE PROCESO (RPA - RPC): "}</strong>
                                    {procesoDetalleData?.usuario_solicitante_id || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"TECNICO DE SEGUIMIENTO (TES): "}</strong>
                                    {procesoDetalleData?.usuario_solicitante2_id || ""}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Box
                                sx={{
                                    minWidth: 240,
                                    minHeight: 90,
                                    flexGrow: 1,
                                    background: '#1976D2',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: '4px' ,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderTopLeftRadius: 0,
                                }}
                            >
                                <Typography color="inherit" variant="subtitle1">
                                   <strong>{'MODALIDAD : '}</strong>
                                    {procesoData?.modalidad_descripcion || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{'CODIGO INTERNO ENTIDAD : '}</strong>
                                     {procesoData?.codigo_interno_entidad || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{'GESTION : '}</strong>
                                    {procesoData?.gestion || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"HOJA DE RUTA: "}</strong>
                                    {procesoDetalleData?.hoja_ruta || ""}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit', fontSize: '11px' }}>
                                    <strong>{"TECNICO DE CONTRATACIONES: "}</strong>
                                    {procesoDetalleData?.usuario_id || ""}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* PANEL CENTRAL */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={7} md={7}>
                            <Box m={2}>
                                {isloading ? (
                                        <>
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                        </>
                                    ) : (
                                        tableParams && (
                                            <ProcesoTimeline
                                                title="Linea temporal del proceso"
                                                list={tableParams.map((item, index) => ({
                                                    id         : index,
                                                    title      : item.titulo,
                                                    subtitle   : item.subtitulo,
                                                    type       : ESTADO_D[item.estado],
                                                    color      : ESTADO_C[item.estado],
                                                    time1      : item.fecha,
                                                    time2      : item.fecha_limite,
                                                    fecha_envio: item.fecha_envio,
                                                    state      : item.estado,
                                                    label1     : 'fecha inicio: ',
                                                    label2     : 'fecha limite: ',
                                                }))}
                                            />
                                        )
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5}>
                            <Box m={2}>
                                {
                                    isloading ? (
                                        <>
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                            <Skeleton sx={{ my: 3 }} />
                                        </>
                                    ) : (
                                            <Paper elevation={2} sx={{backgroundColor: "#F9FAFB"}}>
                                                <Box m={1}>
                                                    <Box p={2} pt={3} pb={0} display="flex" justifyContent="space-between">
                                                        <Typography variant="h6">Observaciones al proceso</Typography>
                                                        {
                                                            (ID_USUARIO===procesoDetalleData?.usuario_TC_id ||ID_USUARIO===procesoDetalleData?.usuario_RPARPC_id
                                                                ||ID_USUARIO===procesoDetalleData?.usuario_TES_id ||ID_USUARIO===procesoDetalleData?.usuario_TJ_id
                                                                || es_super_administrador && procesoDetalleData?.estado_activo !="SUSPENDIDO") &&
                                                                <IconButton color='info' onClick={() => handleClickEdit(procesoDetalleId)}>
                                                                    <AddCommentIcon />
                                                                </IconButton>
                                                        }
                                                    </Box>
                                                    <Box sx={{
                                                            overflowY: 'auto',
                                                            transition: 'height .5s, marginTop .5s',
                                                            height: 800,
                                                            pr: 2,
                                                            pb: 3
                                                         }}
                                                    >
                                                        <Scrollbar>
                                                            <Stack
                                                                spacing={2}
                                                                sx={{ p: 2 }}
                                                            >
                                                                {
                                                                    tableParams && tableParams.map((item: procesoDetalleProps) => (
                                                                        <ProcesoDetalleItem
                                                                            key={item.id}
                                                                            props={{
                                                                                title: item.titulo,
                                                                                description: item.observacion,
                                                                                image: item.imagen,
                                                                                place: item.tiempo,
                                                                                color: item.notificacion,
                                                                                notificacion: item.notificacion_solicitante
                                                                            }}
                                                                        />
                                                                    ))
                                                                }
                                                            </Stack>
                                                        </Scrollbar>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        )
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
};
