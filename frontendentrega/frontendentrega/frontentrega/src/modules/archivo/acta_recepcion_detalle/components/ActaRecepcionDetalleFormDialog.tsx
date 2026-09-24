import React, { ReactElement } from 'react';
import * as yup from 'yup';

import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { useNotify } from 'services/notify';

import { ActaRecepcionDetalleModuleService } from '../ActaRecepcionDetalleModuleService';

import { ENUM_GESTION, ENUM_SINO, ENUM_TIPO_DOCUMENTO } from 'constants/enums';
import { DocumentoModuleService } from 'modules/archivo/documento';

export type ActaRecepcionDetalleFormModel = {
    id?               : number;
    nrodoc            : string;
    tipo              : string;
    descripcion       : string;
    gestion           : string;
    nrofolio          : string;
    acta_recepcion_id?: string | null;
};

type Props = {
    open            : boolean;
    formModel      ?: any;
    actaRecepcionId : string;
    onComplete      : () => void;
};

export const ActaRecepcionDetalleFormDialog = ({ open, formModel, onComplete, actaRecepcionId }: Props): ReactElement => {
    const notify = useNotify();

    const tipoOptions: SelectOption[]    = ENUM_TIPO_DOCUMENTO;
    const gestionOptions: SelectOption[] = ENUM_GESTION;

    const gestion = new Date().getFullYear().toString();

    const formLayout: FormGroup<ActaRecepcionDetalleFormModel>[] = [
        {
            title: '',
            grid: [
                [
                    { name: 'nrodoc', label: 'Nro Documento', type: 'text', infoText: "ej. 123,45,6 (separado por comas ',' los documentos)" },
                ],
                [
                    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions },
                    { name: 'gestion', label: 'Gestion', type: 'select', options: gestionOptions, infoText: "ej. 2024" },
                    { name: 'nrofolio', label: 'Nro Folio', type: 'text', infoText: "ej. 23" },
                ],
                [{ name: 'descripcion', label: 'Descripcion/Glosa', type: 'textarea', rows: 2 }],
            ]
        }
    ];

    const isNroUnique = async (nro: string, gestion: string, tipo: string) => {
        if(!formModel){
            const result = await DocumentoModuleService.getNroDocumentoData2(nro, gestion, tipo);
            const exists = Boolean(result.data.nro);
            return !exists;
        }
        return true;
    };

    const validationSchema = yup
        .object({
            nrodoc      : yup.string().required(),
            tipo        : yup.string()
                                .required()
                                .test('is-unique', 'El número de documento ya existe con el tipo o gestión', async (value, context) => {
                                const gestionValue = context.parent.gestion;
                                const nrodocValue = context.parent.nrodoc;
                                if (value !== undefined && gestionValue!== undefined && nrodocValue!== undefined) {
                                    return await isNroUnique(nrodocValue, gestionValue, value);
                                }
                                return true;
                             }),
            descripcion: yup.string().required(),
            nrofolio   : yup.number().required(),
            gestion    : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ActaRecepcionDetalleModuleService.createOrUpdateActaRecepcionDetalle(formData as unknown as ActaRecepcionDetalleFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: ActaRecepcionDetalleFormModel = {
        nrodoc     : '',
        tipo       : '',
        gestion    : gestion,
        nrofolio   : '',
        descripcion: '',
        acta_recepcion_id: actaRecepcionId,
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        nrodoc     : formModel.nrodoc,
        tipo       : formModel.tipo,
        gestion    : formModel.gestion,
        nrofolio   : formModel.nrofolio,
        descripcion: formModel.descripcion,
        acta_recepcion_id: formModel.acta_recepcion_id,
    };

    return (
        <>
            <FormDialog
                editTitle="Editar Acta Recepcion Documento"
                open={open}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={newFormModel || zeroValues}
                formLayout={formLayout}
                validationSchema={validationSchema}
                isEdit={typeof formModel !== 'undefined'}
            />
        </>
    );
};

