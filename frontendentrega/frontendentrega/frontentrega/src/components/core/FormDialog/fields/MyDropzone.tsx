import React, { forwardRef, ReactElement, useEffect, useImperativeHandle, useState } from 'react';
import { useField, FormikProps, FormikValues } from 'formik';
import { v4 as uuid } from 'uuid';
// mui
import { FormHelperText, FormControl, FormLabel, Chip, Box, CircularProgress, LinearProgress, Typography, useTheme } from '@mui/material';
import { DropzoneAreaBase, FileObject } from 'mui-file-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import { FileItem, FormDialogRefProps, OnChangeFunction } from '../Types';
import { useNotify } from 'services/notify';
import { BaseService } from 'services/base/BaseService';
import { useIsMounted } from 'hooks/useIsMounted';
import { BaseResponse, UploadResponseModel } from 'services/base/Types';
import { getAdjuntoDisplayName, normalizeAdjuntosToFileItems } from 'utils/formatFile';

const DEFAULT_FILES_LIMIT = 15;
const DEFAULT_ACCEPTED_FILES: string[] = []; // More info: https://react-dropzone.js.org/#section-accepting-specific-file-types Ej: ['image/*', 'video/*', 'application/*']
const DEFAULT_MAX_FILE_SIZE = 20 * 1024 * 1024; // bytes
const DEFAULT_DROPZONE_TEXT = `Arrastre y suelte un archivo aquí o haga click. (Tamaño máximo: 20MB)`;
// const DEFAULT_VARIANT = 'filled';

type ProgressState = { id: string; value: number } | null;

type Props = {
    name: string;
    label: string;
    value?: string;
    disabled?: boolean;
    fieldRequired?: string;
    error?: boolean;
    helperText?: string;
    formik?: FormikProps<FormikValues>;
    filesLimit?: number;
    filesExt?: string[];
    acceptedFiles?: string[];
    maxFileSize?: number;
    dropzoneText?: string;
    variant?: 'filled' | 'standard' | 'outlined';
    onChange?: OnChangeFunction;
};

const MyDropzoneComponent = (props: Props, ref: React.Ref<FormDialogRefProps>): ReactElement => {
    const { label, name, error, helperText, formik } = props;

    const theme = useTheme();
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [field, meta] = useField<string>(name);
    const errorText = meta.error && meta.touched ? meta.error : '';

    // controlled or uncontrolled
    const _val = typeof props.value !== 'undefined' ? props.value : field.value;
    const VALUE: FileItem[] = normalizeAdjuntosToFileItems(_val || '[]');

    const FILES_EXT = props.filesExt;
    const FILES_LIMIT = props.filesLimit || DEFAULT_FILES_LIMIT;
    const MAX_FILE_SIZE = props.maxFileSize || DEFAULT_MAX_FILE_SIZE;
    const ACCEPTED_FILES = props.acceptedFiles || DEFAULT_ACCEPTED_FILES;
    const DROPZONE_TEXT = props.dropzoneText || DEFAULT_DROPZONE_TEXT;

    // const VARIANT = props.variant  || DEFAULT_VARIANT;
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

    const progressList = [
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null),
        useState<ProgressState>(null)
    ];

    async function uploadFile(fileItem: FileItem, setProgress: (state: ProgressState) => void): Promise<BaseResponse<UploadResponseModel>> {
        const FILE = fileItem.fileObject.file;
        const FILENAME = fileItem.fileName;
        const FILE_ID = FILENAME.substr(0, 36);
        const REAL_FILENAME = FILENAME.replace(`${FILE_ID}-`, '');
        const onProgress = (progress: number, uploaded: boolean) => {
            setProgress(uploaded ? null : { id: FILE_ID, value: progress });
        };
        const tieneExtension = FILENAME.indexOf('.') >= 0;
        if (!tieneExtension) {
            setProgress(null);
            return BaseService.sendError({ msg: `El nombre del archivo es incorrecto (No tiene extensión)\n"${REAL_FILENAME}"` });
        }
        const uploadResponse = await BaseService.uploadFile(FILE, FILENAME, onProgress);
        setProgress(null);
        if (!uploadResponse.success) {
            return BaseService.sendError(uploadResponse);
        }
        return BaseService.sendSuccess(uploadResponse);
    }

    async function removeFile(fileItem: FileItem) {
        return BaseService.removeFile(fileItem.fileName);
    }

    const uploadPromiseField = uploadFile;
    const removePromiseField = removeFile;

    const getExt = (obj: FileObject): string => {
        const dotIndex = obj.file.name.indexOf('.');
        if (dotIndex > -1) {
            return obj.file.name.split('.').pop() || '';
        }
        return '';
    };

    const isUploading = (fileItem?: FileItem): boolean => {
        if (!fileItem) return progressList.some((state) => state[0] !== null);
        return progressList.some((state) => state[0] !== null && state[0].id === fileItem.id);
    };

    const handleDropzoneOnAdd = async (newFileObjs: FileObject[]) => {
        if (isUploading()) {
            notify.info('Espere a que se guarden todos los archivos.');
            return;
        }
        if (newFileObjs.length > FILES_LIMIT) {
            notify.error('Solo puede cargar ' + FILES_LIMIT + ' archivo(s).');
            return;
        }
        if (VALUE.length + newFileObjs.length > FILES_LIMIT) {
            notify.error('Solo puede cargar ' + FILES_LIMIT + ' archivo(s).');
            return;
        }
        if (FILES_EXT) {
            const EXT_VALIDAS = FILES_EXT.map((ext) => `*.${ext}`).join(', ');
            const archivosNoValidos = newFileObjs.filter((obj) => {
                const ext = getExt(obj);
                const esValido = FILES_EXT.includes(ext);
                if (!esValido) {
                    notify.error(`Formato de archivo incorrecto (${obj.file.name}). Extensiones válidas: ${EXT_VALIDAS}`);
                }
                return !esValido;
            });
            if (archivosNoValidos.length > 0) return;
        }
        const promises: Promise<BaseResponse<UploadResponseModel>>[] = [];
        const emptyArray: FileItem[] = [];
        const newFileItemValue = emptyArray.concat(VALUE);

        newFileObjs.forEach((fileObject, index) => {
            // Verifica que no se carguen más de 10 arhivos a la vez.
            if (index >= 10) {
                notify.error('Solo puede cargar 10 archivos al mismo tiempo.');
                return;
            }
            const stateFree = progressList[index];

            const FILE_ID = uuid();
            const newFileItem: FileItem = {
                id: FILE_ID,
                fileName: `${FILE_ID}-${fileObject.file.name}`,
                filePath: '', // ya no se utiliza
                fileType: '*',
                fileObject: fileObject
            };
            const cb = (state: ProgressState) => {
                if (isMounted()) stateFree[1](state);
            };
            cb({ id: FILE_ID, value: 0 });
            promises.push(uploadPromiseField(newFileItem, cb));
            newFileItemValue.push(newFileItem);
        });

        const newValue = JSON.stringify(newFileItemValue.map(({ id, fileName, filePath, fileType }) => ({ id, fileName, filePath, fileType })));

        if (props.onChange) props.onChange(newValue, formik, newFileItemValue);
        else formik?.setFieldValue(name, newValue);

        await Promise.all(promises).then((results) => {
            for (const result of results) {
                if (!result.success) {
                    notify.error(result.msg);
                    const rollbackValue = JSON.stringify(
                        VALUE.map(({ id, fileName, filePath, fileType }) => ({
                            id,
                            fileName,
                            filePath,
                            fileType
                        }))
                    );

                    if (props.onChange) props.onChange(rollbackValue, formik, VALUE);
                    else formik?.setFieldValue(name, rollbackValue);
                    break;
                }
            }
        });
    };

    const handleDropzoneOnDelete = async (deleteFileItem: FileItem) => {
        if (isUploading(deleteFileItem)) {
            notify.info('Por favor espere a que se guarde el archivo.');
            return;
        }
        const newFileItemValue = VALUE.filter((item: FileItem) => item.id !== deleteFileItem.id);
        const newValue = JSON.stringify(newFileItemValue.map(({ id, fileName, filePath, fileType }) => ({ id, fileName, filePath, fileType })));

        if (props.onChange) props.onChange(newValue, formik, newFileItemValue);
        else formik?.setFieldValue(name, newValue);

        await removePromiseField(deleteFileItem).then((result) => {
            // if (!result.success) notify.error(result.msg);
        });
    };

    const handleClick = async (fileItem: FileItem): Promise<void> => {
        if (isUploading(fileItem)) {
            notify.info('Por favor espere a que se guarde el archivo.');
            return;
        }

        try {
            const url: string = BaseService.buildPublicURL(fileItem.fileName);
            window.open(url, '_blank', 'noopener');
        } catch (err: unknown) {
            notify.error(`Error al abrir el archivo: ${String(err)}`);
        }
    };

    const handleOnAlert = (message: string, variant: string) => {
        if (variant === 'error') {
            if (message.includes('File is too big')) {
                const maxSize = Number(MAX_FILE_SIZE / 1024 / 1024);
                return notify.error(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
            }
            console.log(`Error al adjuntar el archivo. ${message}`);
        }
    };

    const truncateText = (text: string, max: number = 20) => {
        if (text.length <= max) return text;
        const middle = parseInt(`${max / 2}`);
        const a = text.substr(0, middle);
        const b = text.substr(text.length - middle);
        const truncated = `${a} ... ${b}`;
        return truncated;
    };

    const refHandler = () => ({
        isPrepared: () => !isUploading()
    });
    useImperativeHandle(ref, refHandler, [isUploading]);

    const dropzoneContainer = `minHeight: ${theme.spacing(0)}, padding: ${theme.spacing(0, 1, 1, 1)},`;
    const dropzoneContainerHidden = `display: 'none'`;

    const dropzoneStyle = dropzoneContainer && isUploading() ? dropzoneContainerHidden : '';
    const dropzoneParagraph = `color: 'rgba(34,47,62,.7)', fontSize: '18px', padding: ${theme.spacing(0)}, margin: ${theme.spacing(1, 0, 0, 0)},`;
    const errorStyle = `color: 'red'`;
    const dropzoneParagraphStyle = dropzoneParagraph && !!errorText ? errorStyle : '';

    return (
        <FormControl
            sx={{
                width: '100%',
                paddingTop: theme.spacing(0)
            }}
            error={error || !!errorText}
        >
            <Box
                sx={{
                    borderTopLeftRadius: theme.spacing(0.5),
                    borderTopRightRadius: theme.spacing(0.5),
                    background: '#e8e8e8'
                }}
            >
                <FormLabel component="legend">{label}</FormLabel>
                {isUploading() && (
                    <Box
                        sx={{
                            border: 'dashed',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '4px',
                            background: '#fff',
                            color: 'rgba(34,47,62,.7)',

                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '80px',
                            padding: theme.spacing(1),

                            backgroundColor: '#a3cc72',
                            backgroundImage: `linear-gradient(
                                -45deg,
                                rgba(255, 255, 255, .2) 25%,
                                transparent 25%,
                                transparent 50%,
                                rgba(255, 255, 255, .2) 50%,
                                rgba(255, 255, 255, .2) 75%,
                                transparent 75%,
                                transparent
                                )`,
                            backgroundSize: '50px 50px',
                            animation: '$move 2s linear infinite'
                        }}
                    >
                        <Typography align="center" variant="h6">
                            Guardando archivos...
                        </Typography>
                        <Typography align="center" variant="body1">
                            Por favor espere a que se guarden todos los archivos antes de continuar.
                        </Typography>
                    </Box>
                )}
                <DropzoneAreaBase
                    fileObjects={[]}
                    onAdd={handleDropzoneOnAdd}
                    dropzoneClass={dropzoneStyle}
                    dropzoneParagraphClass={dropzoneParagraphStyle}
                    dropzoneText={DROPZONE_TEXT}
                    showPreviewsInDropzone={false}
                    useChipsForPreview={false}
                    showAlerts={false}
                    filesLimit={FILES_LIMIT}
                    acceptedFiles={ACCEPTED_FILES}
                    maxFileSize={MAX_FILE_SIZE}
                    onAlert={handleOnAlert}
                    inputProps={{ disabled: DISABLED }}
                />
                <Box sx={{ minHeight: theme.spacing(1) }}>
                    {VALUE.map((item) => {
                        const state = progressList.find((state) => state[0] !== null && state[0].id === item.id);
                        const value = state && state[0] !== null ? state[0].value : null;
                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px'
                                }}
                            >
                                <Chip
                                    sx={{ zIndex: 2, ...(!value && { bgcolor: 'primary.lighter' }) }}
                                    label={truncateText(getAdjuntoDisplayName(item))}
                                    variant="outlined"
                                    deleteIcon={value !== null ? <CircularProgress size="small" /> : <CloseIcon />}
                                    onDelete={() => handleDropzoneOnDelete(item)}
                                    onClick={() => handleClick(item)}
                                    disabled={DISABLED}
                                />
                                {value !== null ? (
                                    <LinearProgress
                                        sx={{
                                            position: 'absolute',
                                            width: 'calc(100% - 10px)',
                                            height: 'calc(100% - 10px)',
                                            bottom: '4px',
                                            left: '5px',
                                            borderRadius: '16px',
                                            backgroundColor: '#ffffff',
                                            '& .MuiLinearProgress-barColorPrimary': {
                                                backgroundColor: '#a3cc72',
                                                backgroundImage: `linear-gradient(
                                                    -45deg,
                                                    rgba(255, 255, 255, .2) 25%,
                                                    transparent 25%,
                                                    transparent 50%,
                                                    rgba(255, 255, 255, .2) 50%,
                                                    rgba(255, 255, 255, .2) 75%,
                                                    transparent 75%,
                                                    transparent
                                                    )`,
                                                backgroundSize: '50px 50px',
                                                animation: '$move 2s linear infinite'
                                            }
                                        }}
                                        variant="determinate"
                                        value={value}
                                    />
                                ) : (
                                    <></>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <FormHelperText sx={{ paddingLeft: theme.spacing(1.5) }}>{helperText || errorText}</FormHelperText>
        </FormControl>
    );
};

export const MyDropzone = forwardRef(MyDropzoneComponent);
