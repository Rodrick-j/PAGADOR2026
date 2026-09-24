import React, { ReactElement, useEffect,useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { HistorialAperturaDetalleModuleService } from '../HistorialAperturaDetalleModuleService';
import { useNotify } from 'services/notify';
//import { useIsMounted } from 'hooks/useIsMounted';
import { AperturaGeneralModuleService } from 'modules/apertura/apertura_general';
import { ENUM_DEBE_HABER } from 'constants/enums';

export type HistorialAperturaDetalleFormModel = {
    id?         : string;   
    titulo      : string;
    gasto       : number;
    descripcion : string;
    apertura_id   : string;
    saldo?       : number;
    debe_haber?   : string;

    apertura_programatica? : string;
    descripcion_apertura?  :string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

export type PresupuestoTableModel = {
    id                    : string;
    presupuesto_inicial   : number;
    presupuesto_restante   : number;
};
type Props = {
    open: boolean;
    formModel?: HistorialAperturaDetalleFormModel;
    onComplete: () => void;
    aperturaId: string;
};

const debeHaberOptions: SelectOption[] = ENUM_DEBE_HABER;

export const HistorialAperturaDetalleFormDialog = ({ open, formModel, onComplete, aperturaId }: Props): ReactElement => {
    const notify = useNotify(); 
    //const isMounted = useIsMounted();
    const [Presupuesto, setPresupuesto] = useState<PresupuestoTableModel>();
    const [showDebeHaber, setDebeHaber] = useState<string>('');


     // Inicializa el estado del formulario basado en formModel o valores predeterminados
     const [formValues, setFormValues] = useState<HistorialAperturaDetalleFormModel>(() => ({
        ...{
            titulo     : '',
            descripcion: '',
            gasto      : 0,
            apertura_id  : aperturaId,
            debe_haber :'EGRESO',
        },
        ...formModel // Sobrescribe valores predeterminados con los valores del formModel
    }));

       useEffect(() => {
        // Actualiza formValues cuando formModel cambie
        if (formModel) {
            setFormValues(prev => ({
                ...prev,
                ...formModel
            }));
            setDebeHaber(formModel.debe_haber!);
        }
    }, [formModel]);
        
    const formLayout: FormGroup<HistorialAperturaDetalleFormModel>[] = [
        {
            title: 'Datos del Gasto a Efectuar',
            grid: [            
                [{ name: 'debe_haber', label: 'Debe marcar si es un Ingreso o Egreso', type: 'radio-group', 
                    options: debeHaberOptions, inlineDisplay: true,
                    onChange: (value, formik) => {
                        formik.setFieldValue('debe_haber', value);
                        setDebeHaber(String(value));
                    }, },],
               
                [   
                    { name: 'titulo', label: 'Titulo Gasto / Ingreso', type: 'text',infoText:"Titulo del Gasto" },],
                   
                [                   
                    { name: 'descripcion', label: 'Descripcion Gasto / Ingreso', type: 'textarea', rows: 3, infoText: 'Descripcion del Gasto' },                 
                ],
                [                  
                    { name: 'gasto', label: 'Monto Gasto / Ingreso', type: 'text', infoText: 'ej. 550' },                   
                    { type: 'empty' },
                    { name: 'saldo', label:String(Presupuesto?.presupuesto_restante),type: 'text', infoText: "Saldo Restante en la Apertura", disabled: true },
                ],
            ]
        }
    ];

    const isNumberUnique = async (nro: number, apertura_id:string, debe_haber:string) => {
	
        const n = Number(formModel && formModel.gasto);	
        if(n!==nro){
            const result = await AperturaGeneralModuleService.getVerificaPresupuesto(nro, apertura_id, debe_haber);				
            const exists = Boolean(result.data.gasto);				          
            return exists;			
        }
        return true;
    };


    const validationSchema = yup
        .object({
            debe_haber : yup.string(),
            titulo     : yup.string().required(),
            descripcion: yup.string().required(),
            gasto      : yup.number().required()
            .test('is-unique', 'El monto a gastar excede al restante en la Apertura', async (value, contexto) => {
                 const apertura = contexto.parent.apertura_id;                
                 const debeHaber = contexto.parent.debe_haber; 
                 if (value !== undefined) {
                    return await isNumberUnique(value, apertura,debeHaber);
                }
                return true;
            }),
            apertura_id  : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
	
        const result = await HistorialAperturaDetalleModuleService.createOrUpdateHistorialAperturaDetalle(formData as unknown as HistorialAperturaDetalleFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };
    
    useEffect(() => {
        const fetchData = async () => {
           // if (!useIsMounted()) return;          
            const resultPresupuesto = await AperturaGeneralModuleService.getPresupuesto(aperturaId);
		
            if (!resultPresupuesto || !resultPresupuesto.success) return;
            const newPresupuesto = resultPresupuesto.data; 		
//if (isMounted()) 
            setPresupuesto(newPresupuesto);                        
            
        };
        if (open) {
            fetchData();
        }
    }, [open, formModel]);

    const zeroValues: HistorialAperturaDetalleFormModel = {
       
        titulo     : '',
        descripcion: '',
        gasto      : 0,
        apertura_id  : aperturaId,
        debe_haber :'EGRESO',
    };
// Función para limpiar el formulario
const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };
  

    return (
        <FormDialog
            addTitle="Agregar Solicitud Gasto"
            editTitle="Editar Solicitud Gasto"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            //initialValues={newFormModel || zeroValues}
            initialValues={formValues}
            formLayout={formLayout}           
            validationSchema={validationSchema}            
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};

