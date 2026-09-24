import React, { ReactElement, useEffect, useState } from 'react';
import { useField, FormikProps, FormikValues } from 'formik';
import { TextField, Box, Typography, SelectChangeEvent, useTheme, Checkbox, List, ListItem, CircularProgress, Popover, Button, FormControl, FormHelperText, IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { FormValue, SelectOption, OnChangeFunction } from '../Types';

const DEFAULT_SELECT = 'filled';
const SIN_OPCIONES_TEXT = '>>> Sin opciones <<<';
const MARCAR_TODOS_TEXT = 'Marcar TODOS';
const DESMARCAR_TODOS_TEXT = 'Desmarcar TODOS';
const REMOTE_PAGE_SIZE = 25;

type Props = {
    name          : string;
    label         : string;
    disabled     ?: boolean;
    value        ?: (number | string)[];
    error        ?: boolean;
    helperText   ?: string;
    formik       ?: FormikProps<FormikValues>;
    options       : SelectOption[] | ((formValue: FormValue) => SelectOption[]);
    fieldRequired?: string;
    onChange     ?: OnChangeFunction;
    remoteSearch ?: (searchText: string, formValue: FormValue, selectedValues: (string | number)[], page?: number) => Promise<SelectOption[]>;
};

const mergeOptions = (baseOptions: SelectOption[], newOptions: SelectOption[]): SelectOption[] => {
    const optionMap = new Map<string | number, SelectOption>();
    [...baseOptions, ...newOptions].forEach((option) => optionMap.set(option.value, option));
    return Array.from(optionMap.values());
};

export const MyMultipleSelect2 = (props: Props): ReactElement => {
    const { name, label, error, helperText, formik } = props;
    const [field, meta] = useField<(number | string)[]>(name);
    const theme = useTheme();
    const errorText = meta.error && meta.touched ? meta.error : '';

    const BASE_OPTIONS = typeof props.options === 'function' ? props.options(formik?.values as FormValue) : props.options;
    const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([]);
    const OPTIONS = props.remoteSearch ? mergeOptions(BASE_OPTIONS, remoteOptions) : BASE_OPTIONS;
    const OPTIONS_VALUE = OPTIONS.map((opt) => opt.value);
    const _val = typeof props.value !== 'undefined' ? props.value : field.value;
    const SELECTED_VALUES = Array.isArray(_val) ? _val : [];
    const VALUE = OPTIONS.filter((opt) => _val && _val.includes(opt.value)).map((opt) => opt.value);
    const SELECTED_VALUES_KEY = SELECTED_VALUES.join('|');

    const [allSelected, setAllSelected] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibleItems, setVisibleItems] = useState(10); // Mostrar 10 ítems inicialmente
    const [isLoading, setIsLoading] = useState(false);
    const [remotePage, setRemotePage] = useState(1);
    const [remoteHasMore, setRemoteHasMore] = useState(true);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    // Filtrar opciones según el término de búsqueda
    const filteredOptions = props.remoteSearch ? OPTIONS : OPTIONS.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalItems = filteredOptions.length;

    useEffect(() => {
        if (props.remoteSearch) {
            setAllSelected(false);
            return;
        }
        const newAllSelected = VALUE.length > 0 ? JSON.stringify(VALUE.sort()) === JSON.stringify(OPTIONS.map((opt) => opt.value).sort()) : false;
        setAllSelected(newAllSelected);
    }, [VALUE, OPTIONS, props.remoteSearch]);

    useEffect(() => {
        if (!open || !props.remoteSearch) return;

        let active = true;
        setIsLoading(true);
        const timer = window.setTimeout(() => {
            props.remoteSearch?.(searchTerm, formik?.values as FormValue, SELECTED_VALUES, remotePage)
                .then((options) => {
                    if (!active) return;
                    setRemoteOptions((prev) => remotePage === 1 ? options : mergeOptions(prev, options));
                    setRemoteHasMore(options.length >= REMOTE_PAGE_SIZE);
                })
                .finally(() => {
                    if (active) setIsLoading(false);
                });
        }, 350);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [open, searchTerm, props.remoteSearch, SELECTED_VALUES_KEY, remotePage]);

    useEffect(() => {
        setVisibleItems(10);
    }, [searchTerm]);

    const FIELD_REQUIRED = props.fieldRequired;
    const [DISABLED, setDisabled] = useState(false);
    const requiredValue = FIELD_REQUIRED ? formik?.values[FIELD_REQUIRED] : undefined;
    useEffect(() => {
        const disableByProp = typeof props.disabled !== 'undefined' ? props.disabled : false;
        let newFieldDisabled = disableByProp;
        if (!disableByProp && FIELD_REQUIRED) {
            newFieldDisabled =
                requiredValue === undefined ||
                requiredValue === '' ||
                requiredValue === null ||
                requiredValue === '[]' || // Para los archivos adjuntos (MyDropzone)
                requiredValue === '{}' || // Para los grupos de checkbox (MyCheckboxGroup)
                (Array.isArray(requiredValue) && requiredValue.length === 0);
        }
        setDisabled(newFieldDisabled);
    }, [props.disabled, FIELD_REQUIRED, requiredValue]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

        if (props.remoteSearch) {
            if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading && remoteHasMore) {
                setIsLoading(true);
                setRemotePage((prev) => prev + 1);
            }
            return;
        }

        if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
            if (visibleItems < totalItems) {
                setIsLoading(true);
                setTimeout(() => {
                    setVisibleItems((prev) => prev + 10); // Cargar 10 elementos más
                    setIsLoading(false);
                }, 500); // Simula el tiempo de carga
            }
        }
    };

    const handleChange = (event: SelectChangeEvent<any>) => {
        let newValue = event.target.value as unknown as any[];
        if (newValue.includes(SIN_OPCIONES_TEXT)) return;

        const marcarTodosClicked = newValue.includes(MARCAR_TODOS_TEXT);
        if (marcarTodosClicked) {
            newValue = OPTIONS_VALUE;
        }

        const desmarcarTodosClicked = newValue.includes(DESMARCAR_TODOS_TEXT);
        if (desmarcarTodosClicked) {
            newValue = [];
        }

        if (props.onChange) props.onChange(newValue, formik);
        else formik?.setFieldValue(name, newValue);
    };

    const handleSelect = (value: string | number) => {
        const newValue = VALUE.includes(value)
            ? VALUE.filter((v) => v !== value) // Deseleccionar item
            : [...VALUE, value];               // Seleccionar item

        if (props.onChange) props.onChange(newValue, formik);
        else formik?.setFieldValue(name, newValue);
    };

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setVisibleItems(10);
        setRemotePage(1);
        setRemoteHasMore(true);
        if (props.remoteSearch) setRemoteOptions([]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setVisibleItems(10);
        if (props.remoteSearch) {
            setRemotePage(1);
            setRemoteHasMore(true);
            setRemoteOptions([]);
        }
    };

    const buttonWidth = anchorEl?.getBoundingClientRect().width;
    const popoverWidth = buttonWidth ? Math.max(buttonWidth, 520) : undefined;

    return (
        <>
        <FormControl sx={{ width: '100%' }} error={error || !!errorText}>
            <Typography id={`${name}-label`} sx={{ fontSize: '11.5px' }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                <Button
                    onClick={handleOpen}
                    variant="outlined"
                    disabled={DISABLED}
                    name={name}
                    sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        fontWeight: 'normal',
                        margin: theme.spacing(0),
                        padding: theme.spacing(1)
                    }}
                >
                    <Typography noWrap variant="body2" sx={{ width: '100%', fontWeight: 'normal' }}>
                        {VALUE.map(v => OPTIONS.find(opt => opt.value === v)?.label).join(',') || 'Seleccione...'}
                    </Typography>
                </Button>
                {open && (
                    <Tooltip title="Cerrar lista">
                        <span>
                            <IconButton
                                color="success"
                                disabled={DISABLED}
                                onClick={handleClose}
                                sx={{
                                    ml: 0.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    minWidth: theme.spacing(5),
                                    height: '100%'
                                }}
                            >
                                <CheckIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{
                    '.MuiPaper-elevation8': {
                        width: popoverWidth,
                        maxWidth: 'calc(100vw - 32px)',
                    }
                }}
            >
                <Box sx={{ padding: theme.spacing(2), width: '100%' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar..."
                        size="small"
                        sx={{ marginBottom: theme.spacing(2) }}
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Box
                        sx={{
                            maxHeight: 260,
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            width: '100%',
                            padding: theme.spacing(1)
                        }}
                        onScroll={handleScroll}
                    >
                        <List dense>
                            {!props.remoteSearch && (
                                <ListItem key="select_all" disableGutters>
                                    <Checkbox
                                        checked={allSelected}
                                        color="primary"
                                        onClick={() => handleChange({ target: { value: allSelected ? [] : OPTIONS_VALUE } } as SelectChangeEvent<any>)}
                                    />
                                    <Typography variant="body2">{allSelected ? DESMARCAR_TODOS_TEXT : MARCAR_TODOS_TEXT}</Typography>
                                </ListItem>
                            )}
                            {filteredOptions.slice(0, props.remoteSearch ? filteredOptions.length : visibleItems).map((option) => (
                                <ListItem key={option.value} sx={{ padding: 0, marginTop: 1 }}>
                                    <Checkbox
                                        checked={VALUE.includes(option.value)}
                                        color="primary"
                                        onChange={() => handleSelect(option.value)}
                                    />
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{option.label}</Typography>
                                        {option.caption && (
                                            <Typography sx={{ color: '#aaaaaa', lineHeight: 1, wordBreak: 'break-word' }} variant="subtitle2" component='p'>
                                                {option.caption}
                                            </Typography>
                                        )}
                                    </Box>
                                </ListItem>
                            ))}
                            {filteredOptions.length === 0 && !isLoading && (
                                <ListItem disableGutters>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{SIN_OPCIONES_TEXT}</Typography>
                                </ListItem>
                            )}
                        </List>
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                <CircularProgress size={24} /><Typography variant='caption' >Cargando...</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Popover>
            <FormHelperText>{helperText || errorText}</FormHelperText>
            </FormControl>
        </>
    );
};
