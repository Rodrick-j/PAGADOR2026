// ModalPersonalizadoDialog.tsx
import React, {  useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputLabel,
  Typography,
  Select,
  MenuItem
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (estadoModificacion: { a: string; b: string }[], observaciones: { a: string; b: string }[]) => void;
  mainMessage : string;
  message:string;
  rangoFechas: { id: Date; nombre: string; caption: string }[];
  obs: { value: string; label: string }[];
  
}

const ModalPersonalizadoDialog: React.FC<Props> = ({ open, onClose, onConfirm,mainMessage,message,rangoFechas, obs }) => {
  //const [dato1, setDato1] = useState('');
  const [dato2, setDato2] = useState('');
  const [dato3, setDato3] = useState('');
  const [valoresSel, setValoresSel] = useState<{ a: string; b: string }[]>([]);  
  const [valores, setValores] = useState<{ a: string; b: string }[]>([]);  

 
  const [observaciones, setObservaciones] = useState<{ a: string; b: string }[]>([]);  
  const [estadoModificacion, setEstadoModificacion] = useState<{ a: string; b: string }[]>([]);  
 
    useEffect(() => {
    if (open) {
      // Reinicia los valores cada vez que se abre el modal
      const valoresIniciales = rangoFechas?.map(() => ({
        a: '', // campo de fecha (si lo usas como editable)
        b: '', // observación
      })) || [];
      setValores(valoresIniciales);
      setValoresSel(valoresIniciales);
    }
  }, [open, rangoFechas]);

  const handleConfirm = () => {
    onConfirm(estadoModificacion, observaciones);	    
    setEstadoModificacion([]);
    setObservaciones([]);
  };
//Debo modificar para que me devuelva una lista
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{mainMessage}</DialogTitle>
      <Typography variant="body2" style={{ whiteSpace: 'pre-line' }} sx={{ marginLeft: '0.5cm' }}>
    {message}
     </Typography>

      <DialogContent>
            {[...Array(rangoFechas.length)].map((_, index) => (
                
            <div key={index} className="flex gap-2 mb-2 items-start">
                <TextField
                    label={`Fecha ${index + 1}`}
                    value={rangoFechas[index]?.nombre || ''}                  
                    fullWidth
                    disabled
                    margin="dense"
                    sx={{ flex: 1 }}
                    size="small"
                />
                
                <Select
                        value={valoresSel[index]?.b || ''}
                        onChange={(e) => {
                        const nuevosValores = [...valoresSel];					
                        nuevosValores[index] = {
                            ...nuevosValores[index],
                            a: rangoFechas[index]?.nombre,
                            b: e.target.value,
                        };
                        setValoresSel(nuevosValores);
                        setEstadoModificacion(nuevosValores);
                        }}
                        fullWidth
                       sx={{ 
                            flex: 1.5,
                            mt: '8px',
                            '& .MuiSelect-select': {
                              paddingTop: '8.5px',
                              paddingBottom: '8.5px',
                            }
                          }}
                        size="small"
                    >
                        {obs.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                       
                        ))}
                    </Select>

                <TextField
                    label={`Observacion ${index + 1}`}
                    value={valores[index]?.b || ''}
                    onChange={(e) => {
                    const nuevosValores = [...valores];
                    nuevosValores[index] = {
                        ...nuevosValores[index],
                        a: rangoFechas[index]?.nombre,
                        b: e.target.value,
                    };                    
                    setValores(nuevosValores);
                    setObservaciones(nuevosValores);
                    }}
                    fullWidth
                    margin="dense"
                    sx={{ flex: 3 }}
                    size="small"
                    multiline
                    minRows={3}
                />  
            </div>
        ))}
    
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPersonalizadoDialog;
