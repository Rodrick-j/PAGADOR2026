import React, { ReactElement, useState } from 'react';
import { Box, Card, CardActions, CardContent, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { ValeTableModel } from './ValeTable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ESTADO_B, ESTADO_E } from 'constants/colors';
import { fCurrency } from 'utils/formatNumber';

type Props = {
    data: ValeTableModel;
    refresh: () => void;
    onViewClick?: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    onImprimirClick?: () => void;
    loading: string;
};

export const ValeTableItem = ({ data, loading, refresh, onEditClick, onViewClick, onDeleteClick, onImprimirClick }: Props): ReactElement => {

    const renderViewButton = () => {
        return (
            <IconButton color="primary" component="span" size="small" onClick={() => (onViewClick ? onViewClick() : false)}>
                <VisibilityIcon />
            </IconButton>
        );
    };

    const renderEditButton = () => {
        return (
            <IconButton color="primary" component="span" size="small" onClick={() => (onEditClick ? onEditClick() : false)}>
                <EditIcon />
            </IconButton>
        );
    };

    function renderImprimirButton(): ReactElement {
        return (
            <IconButton color="primary" component="span" size="small" disabled={loading===data.id} onClick={() => (onImprimirClick ? onImprimirClick() : false)} >
                {loading===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
            </IconButton>
        );
    }

    const [open, setOpen] = useState<boolean>(false);

    /* const renderDeleteButton = () => {
        return (
            <>
                <ConfirmDialog
                    title={'Confirmar'}
                    message={
                        <div>
                            <div>¿Quiere eliminar el registro?</div>
                            <br />
                            <div>
                                <strong>Tipo: </strong> {data.cod_vale}
                            </div>
                        </div>
                    }
                    open={open}
                    onAccept={async () => {
                        setOpen(false);
                        if (onDeleteClick) return onDeleteClick();
                    }}
                    onCancel={() => setOpen(false)}
                />
                <IconButton color="primary" component="span" size="small" onClick={() => setOpen(true)}>
                    <DeleteIcon />
                </IconButton>
            </>
        );
    }; */

    const renderViewState = () => {
        const estado = data.estado;
        const background = ESTADO_E[estado];
        return (
            <Typography
                variant="body2"
                sx={{ float: 'right' }}
            >
                <IconButton size="small">
                    <CheckCircleIcon style={{ fontSize: '14px', color: background }} />
                </IconButton>
            </Typography>
        );
    };
    const precioTotal = fCurrency(data.precio_total);
    const color = data.estado==='ANULADO'?'#FF4747':'green';
    const styleFont = data.estado==='ANULADO'?'line-through':'none';
    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 0 } }}>
                <Stack spacing={1}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, textAlign: 'justify', mb: 0.5 }}>
                            <b>Cod. Vale:&nbsp;</b>{data.cod_vale}
                            {renderViewState()}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, textAlign: 'left', mb: 0.5 }}>
                            <b>Conductor:&nbsp;</b>{data.nombre}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, textAlign: 'left', mb: 0.5 }}>
                            <b>Apertura Prog.:&nbsp;</b>{data.num_apertura}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, mt: 0.5 }}>
                            <b>Placa:&nbsp;</b>{data.placa}<b>&nbsp;Tipo:&nbsp;</b>{data.tipo}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, mt: 0.5 }}>
                            <b>Litros:&nbsp;</b><span style={{color: 'blue', fontWeight: 'bold'}}>{data.litros}</span>&nbsp;&nbsp;<b>&nbsp;Precio Total:&nbsp;</b>
                            <span style={{color: color, fontWeight: 'bold', textDecoration: styleFont}}>{precioTotal} {'Bs.'}</span>
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ lineHeight: 1, textAlign: 'left', mb: 0.5, mt: 0.5 }}>
                            <b>Fecha de Emision:&nbsp;</b>{data.fecha_emision}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {renderImprimirButton()}
                {renderViewButton()}
                {(data.estado !== 'APROBADO' && data.estado !== 'ANULADO') && renderEditButton()}
            </CardActions>
        </Card>
    );
};
