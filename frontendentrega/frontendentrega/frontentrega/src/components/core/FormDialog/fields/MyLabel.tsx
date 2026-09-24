import React, { ReactElement } from 'react';

// material-ui
import { FormControl, FormGroup, FormHelperText, useTheme, FormLabel } from '@mui/material';

type Props = {
    label: string;    
    helperText?: string;
    color?: string;
};

export const MyLabel = (props: Props): ReactElement => {
    const { label, helperText, color } = props;
    const theme = useTheme();
        
    return (
        <FormControl component="fieldset" sx={{ padding: theme.spacing(1.5, 1.5) }}>
            <FormGroup>
                <FormLabel component="legend"  sx={{color: color || 'inherit',fontWeight: 'bold'}}>{label}</FormLabel>
            </FormGroup>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
};
