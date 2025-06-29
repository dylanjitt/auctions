import {useCallback, useEffect, useMemo, useState, type FC} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,Box,
  CircularProgress,
  Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import type { Product } from '../interfaces/productInterface';
import { uploadToCloudinary } from "../util/uploader";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (prod: Product) => void;
}

const schema = yup.object().shape({
  titulo: yup.string().required('Título es requerido'),
  descripcion: yup.string().required('Descripción es requerida'),
  imagen: yup.string().url('Debe ser una URL válida').required('Imagen es requerida'),
  precioBase: yup.number().positive('Debe ser un número positivo').required('Precio base es requerido'),
  duracion: yup.number()
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero')
    .required('Duración es requerida'),
    fechaInicio: yup.date()
    .required('Fecha de inicio es requerida')
    .test(
      'is-future-or-existing',
      'La fecha no puede ser en el pasado para nuevos productos',
      function(value) {
        // @ts-ignore
        return this.parent.id || value >= new Date() // Only validate for new products
      }
    )
});

// Helper function to create clean initial values
const getInitialValues = (product: Product | null): Product => {
  if (product) {
    return {
      ...product,
      fechaInicio: product.fechaInicio || new Date().toISOString()
    };
  }

  // Default values for new product
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() );
  
  return {
    id: '',
    titulo: '',
    descripcion: '',
    imagen: '',
    precioBase: 1,
    duracion: 3600, // 1 hour in seconds
    fechaInicio: tomorrow.toISOString()
  };
};

const BidForm: FC<Props> = ({ open, product, onClose, onSave }) => {
  const initialValues = useMemo(() => getInitialValues(product), [product]);

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const formik = useFormik<Product>({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    validateOnMount:true,
    onSubmit: async (values) => {
      try {
        const dateWithZeroSeconds = new Date(values.fechaInicio);
        dateWithZeroSeconds.setSeconds(0);
        console.log("values:",values)
        await onSave({
          ...values,
          fechaInicio: dateWithZeroSeconds.toISOString(),
        });
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  });

  // Convert seconds to hours for display
  const durationInHours = formik.values.duracion / 3600;

  useEffect(() => {
    if (open) {
      formik.resetForm({ values: getInitialValues(product) });
    }
  }, [open, product]);

  const handleImgUpload = async (file: File) => {
    setUploadingImg(true);
    const reader = new FileReader();
    reader.onload = e => setPreviewImg(e.target?.result as string);
    reader.readAsDataURL(file);
    const url = await uploadToCloudinary(file);
    formik.setFieldValue('imagen', url);
    setUploadingImg(false);
  };

  const onDropImg = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) handleImgUpload(file);
  }, []);
  const onDragOverImg = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), []);


  return (
    <Dialog key={product ? product.id : 'new-product'} open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {product ? 'Editar Subasta' : 'Crear Subasta'}
        </DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            margin="dense" 
            label="Título" 
            name="titulo"
            value={formik.values.titulo} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.titulo && !!formik.errors.titulo} 
            helperText={formik.touched.titulo && formik.errors.titulo}
          />
          
          <TextField 
            fullWidth 
            margin="dense" 
            label="Descripción" 
            name="descripcion"
            multiline
            rows={3}
            value={formik.values.descripcion} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descripcion && !!formik.errors.descripcion} 
            helperText={formik.touched.descripcion && formik.errors.descripcion}
          />
          
          {/* <TextField 
            fullWidth 
            margin="dense" 
            label="Imagen URL" 
            name="imagen"
            value={formik.values.imagen} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.imagen && !!formik.errors.imagen} 
            helperText={formik.touched.imagen && formik.errors.imagen}
          /> */}
          {/* Imagen Drag & Drop */}
          <Box
            onDrop={onDropImg}
            onDragOver={onDragOverImg}
            sx={{ border: '2px dashed #1E8BC3', borderRadius: 2, p: 2, my: 2, textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8f8f8', minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            {uploadingImg ? (
              <CircularProgress />
            ) : previewImg ? (
              <img src={previewImg} alt="Preview" style={{ width: 200, height: 200, objectFit: 'cover' }} />
            ) : (
              <>
                <Typography>Arrastra y suelta la imagen aquí</Typography>
                <Typography variant="caption" color="text.secondary">(o haz clic)</Typography>
              </>
            )}
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => e.target.files && handleImgUpload(e.target.files[0])}
            />
            <label htmlFor="product-image-upload">
              <Button component="span" variant="outlined" sx={{ mt: 1 }}>
                {previewImg ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </Button>
            </label>
          </Box>
          
          <TextField 
            fullWidth 
            margin="dense" 
            label="Precio Base" 
            type="number" 
            name="precioBase"
            value={formik.values.precioBase} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.precioBase && !!formik.errors.precioBase} 
            helperText={formik.touched.precioBase && formik.errors.precioBase}
            inputProps={{ min: 0, step: 0.01 }}
          />
          
          {/* Replaced TimePicker with TextField for duration in hours */}
          <TextField
            fullWidth
            margin="dense"
            label="Duración (horas)"
            type="number"
            name="duracion"
            value={durationInHours}
            onChange={(e) => {
              const hours = parseFloat(e.target.value);
              // Convert hours back to seconds for storage
              formik.setFieldValue('duracion', hours * 3600);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.duracion && !!formik.errors.duracion}
            helperText={formik.touched.duracion && formik.errors.duracion}
            inputProps={{ min: 0, step: 0.25 }} // Allow quarter-hour increments
          />
          
          {/* Replaced DatePicker with DateTimePicker */}
          <DateTimePicker 
            label="Fecha y Hora de Inicio" 
            value={new Date(formik.values.fechaInicio)} 
            sx={{marginY:2, width:'100%'}}
            onChange={(val) => {
              if (val) {
                // Set seconds to 00 immediately when date changes
                val.setSeconds(0);
                formik.setFieldValue('fechaInicio', val.toISOString());
              }
            }}
            minDateTime={!product ? new Date() : undefined} 
            renderInput={(params:any) => 
              <TextField 
                {...params} 
                margin="dense" 
                fullWidth 
                error={formik.touched.fechaInicio && !!formik.errors.fechaInicio}
                helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
              />
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {product ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BidForm;