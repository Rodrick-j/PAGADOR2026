import React, { useState } from 'react';
import { useNotify } from 'services/notify';

/* Material UI */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box,
        CircularProgress,
        DialogActions,
        DialogTitle,
        FormControl,
        FormHelperText,
        Grid,
        IconButton,
        InputAdornment,
        InputLabel,
        OutlinedInput,
        Typography
} from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
/* component own */
import { ProfileModuleService } from './ProfileModuleService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/* component */

type State = {
    password: string;
    passwordConfirm: string;
    showPassword: boolean;
    showPasswordConfirm: boolean;
};

type DialogProps = {
    openDialog: boolean;
    handleDialogClose: () => void;
};

const FormChangeDialog = ({ openDialog, handleDialogClose }: DialogProps) => {
    const notify = useNotify();
    const [values, setValues] = React.useState<State>({
        password: '',
        passwordConfirm: '',
        showPassword: false,
        showPasswordConfirm: false,
    });
    const handleGuardar = () => {
        if (isLoading) return;
        setIsLoading(true);
        ProfileModuleService.resetPassword2(values.password).then((result) => {
            if (!result.success) return setError(result.msg);
            setIsLoading(false);
            notify.success('Contraseña modificada exitosamente');
            setValues({
                password: '',
                passwordConfirm: '',
                showPassword: false,
                showPasswordConfirm: false,
            });
            setIsDirty(false);
            handleDialogClose();
        });
    };

    const [isDirty, setIsDirty] = useState(false);
    const [error, setError] = useState<any>('');
    const [isLoading, setIsLoading] = useState(false);
    const showPasswordError = isDirty && values.password === '';
    const showPasswordConfirmError =
        isDirty && (values.passwordConfirm === '' || values.password !== values.passwordConfirm);
    const handleInputChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
        setIsDirty(true);
    };

    const handleShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleShowPasswordConfirm = () => {
        setValues({ ...values, showPasswordConfirm: !values.showPasswordConfirm });
    };

    return (
        <form>
            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Restablecimiento de contraseña</DialogTitle>
                <DialogContent dividers>
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Crear nueva contraseña
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    variant="outlined"
                                    error={showPasswordError}
                                    fullWidth
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">
                                    Contraseña
                                    {showPasswordError ? <span>&nbsp;&nbsp;*</span> : ''}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleInputChange('password')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                color={showPasswordError ? 'error' : 'inherit'}
                                                edge="end"
                                            >
                                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña"
                                    />
                                    {showPasswordError ? (
                                    <FormHelperText id="component-error-text">
                                        El campo es obligatorio *
                                    </FormHelperText>
                                    ) : (
                                    ''
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    variant="outlined"
                                    error={showPasswordConfirmError}
                                    fullWidth
                                >
                                    <InputLabel htmlFor="outlined-adornment-password-confirm">
                                        Confirmar Contraseña
                                        {showPasswordConfirmError ? <span>&nbsp;&nbsp;*</span> : ''}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password-confirm"
                                        type={values.showPasswordConfirm ? 'text' : 'password'}
                                        value={values.passwordConfirm}
                                        onChange={handleInputChange('passwordConfirm')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle passwordConfirm visibility"
                                                    onClick={handleShowPasswordConfirm}
                                                    color={showPasswordConfirmError ? 'error' : 'inherit'}
                                                    edge="end"
                                                >
                                                    {values.showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirmar Contraseña"
                                    />
                                    {showPasswordConfirmError ? (
                                        <FormHelperText id="component-error-text-password">
                                            El campo no coincide y es obligatorio *
                                        </FormHelperText>
                                    ) : (
                                        ''
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error.message}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={() => handleDialogClose()}>
                        <Box display="flex" alignItems="center" width="30px">
                            <CloseIcon fontSize="small" />
                        </Box>
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleGuardar()}
                        disabled={showPasswordError || showPasswordConfirmError || values.password === ''}
                    >
                        <Box display="flex" alignItems="center" width="30px">
                            {isLoading && <CircularProgress size={18} color="inherit" />}
                            {!isLoading && <CheckIcon fontSize="small" />}
                        </Box>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default FormChangeDialog;
