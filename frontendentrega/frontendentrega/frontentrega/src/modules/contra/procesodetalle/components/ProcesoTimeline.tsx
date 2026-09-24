import React from 'react';
// @mui
import { Card, Typography, CardHeader, CardContent, Link, Box, Paper } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';

import ModeStandbyIcon from '@mui/icons-material/ModeStandby'; //
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; //
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'; //
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; //
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend'; //

// utils
import { fDateTime } from 'utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
    title?: string;
    subtitle?: string;
    subheader?: string;
    list: Array<any>;
};

export default function ProcesoTimeline({ title, subtitle, subheader, list, ...other }: Props) {
    return (
        <Paper
            elevation={3}
            sx={{backgroundColor: "#F9FAFB"}}
        >
            <Box p={2}>
                <Typography variant="h6">{title}</Typography>
            </Box>
            <Timeline position="alternate">
                {list.map((item, index) => (
                    <ProcesoItem key={item.id} item={item} isLast={index === list.length - 1} />
                ))}
            </Timeline>
        </Paper>
    );
}

// ----------------------------------------------------------------------

interface ProcesoItemProps {
    isLast: boolean;
    item: {
        time1      : Date;
        time2      : Date;
        label1     : string;
        label2     : string;
        title      : string;
        color      : string;
        state      : string;
        subtitle   : string;
        fecha_envio: string;
        type       : 'inherit' | 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    };
}

function ProcesoItem({ item, isLast }: ProcesoItemProps) {
    const { type, title, subtitle, time1, time2, label1, label2, color, state, fecha_envio } = item;
    const stateToIcon: any = {
        EN_PROCESO: <ShoppingCartCheckoutIcon />,
        ATENDIDO: <CheckCircleOutlineIcon />,
        PENDIENTE: <ModeStandbyIcon />,
        ATRASADO: <HighlightOffIcon />,
        ATENDIDO_CON_RETRASO: <CancelScheduleSendIcon />,
    };
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color={type}>
                    {
                        stateToIcon[state]
                    }
                </TimelineDot>
                {isLast ? null : <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
                <Paper
                    elevation={8}
                    sx={{
                        padding: "16px 16px",
                        margin: "16px 6px",
                    }}
                >
                    <Link href="#" color="inherit" underline="hover">
                        <Typography variant="subtitle2">{title}</Typography>
                    </Link>
                    <Typography component="span" sx={{ color: color, fontSize: '10px', fontWeight: 'bold'}}>
                        {subtitle}
                    </Typography>
                    { fecha_envio && <Typography component="span"  sx={{ color: 'text.secondary', fontSize: '10px'}}>
                            {" enviado el "+fecha_envio}
                        </Typography>
                    }
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '10px', fontStyle: 'italic'}}>
                        { label1 + fDateTime(time1)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '10px', fontStyle: 'italic'}}>
                        { label2 + fDateTime(time2)}
                    </Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
    );
}
