import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, CircularProgress, Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import type { Product } from '../interfaces/productInterface';
import { uploadToCloudinary } from '../util/uploader';

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (prod: Product) => void;
}

const getInitialValues = (product: Product | null): Product => {
  if (product) {
    return {
      ...product,
      fechaInicio: product.fechaInicio || new Date().toISOString()
    };
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());

  return {
    id: '',
    titulo: '',
    descripcion: '',
    imagen: '',
    precioBase: 1,
    duracion: 3600,
    fechaInicio: tomorrow.toISOString()
  };
};

const BidForm: FC<Props> = ({ open, product, onClose, onSave }) => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    titulo: yup.string().required(t('form.titulo_requerido')),
    descripcion: yup.string().required(t('form.descripcion_requerida')),
    imagen: yup.string().url(t('form.url_valida')).required(t('form.imagen_requerida')),
    precioBase: yup.number().positive(t('form.numero_positivo')).required(t('form.precio_base_requerido')),
    duracion: yup.number()
      .positive(t('form.numero_positivo'))
      .integer(t('form.numero_entero'))
      .required(t('form.duracion_requerida')),
    fechaInicio: yup.date()
      .required(t('form.fecha_inicio_requerida'))
      .test(
        'is-future-or-existing',
        t('form.fecha_no_pasado'),
        function (value) {
          return this.parent.id || value >= new Date();
        }
      )
  });

  const initialValues = useMemo(() => getInitialValues(product), [product]);

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const formik = useFormik<Product>({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const dateWithZeroSeconds = new Date(values.fechaInicio);
        dateWithZeroSeconds.setSeconds(0);
        await onSave({
          ...values,
          fechaInicio: dateWithZeroSeconds.toISOString(),
        });
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  });

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
        <DialogTitle>{product ? t('form.editar_subasta') : t('form.crear_subasta')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label={t('form.titulo')}
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
            label={t('form.descripcion')}
            name="descripcion"
            multiline
            rows={3}
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descripcion && !!formik.errors.descripcion}
            helperText={formik.touched.descripcion && formik.errors.descripcion}
          />
          <Box
            onDrop={onDropImg}
            onDragOver={onDragOverImg}
            sx={{
              border: '2px dashed #1E8BC3',
              borderRadius: 2,
              p: 2,
              my: 2,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f8f8f8',
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {uploadingImg ? (
              <CircularProgress />
            ) : previewImg ? (
              <img src={previewImg} alt="Preview" style={{ width: 200, height: 200, objectFit: 'cover' }} />
            ) : (
              <>
                <Typography>{t('form.arrastra_imagen')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ({t('form.o_haz_clic')})
                </Typography>
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
                {previewImg ? t('form.cambiar_imagen') : t('form.seleccionar_imagen')}
              </Button>
            </label>
          </Box>

          <TextField
            fullWidth
            margin="dense"
            label={t('form.precio_base')}
            type="number"
            name="precioBase"
            value={formik.values.precioBase}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.precioBase && !!formik.errors.precioBase}
            helperText={formik.touched.precioBase && formik.errors.precioBase}
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            fullWidth
            margin="dense"
            label={t('form.duracion_horas')}
            type="number"
            name="duracion"
            value={durationInHours}
            onChange={(e) => {
              const hours = parseFloat(e.target.value);
              formik.setFieldValue('duracion', hours * 3600);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.duracion && !!formik.errors.duracion}
            helperText={formik.touched.duracion && formik.errors.duracion}
            inputProps={{ min: 0, step: 0.25 }}
          />

          <DateTimePicker
            label={t('form.fecha_hora_inicio')}
            value={new Date(formik.values.fechaInicio)}
            sx={{ marginY: 2, width: '100%' }}
            onChange={(val) => {
              if (val) {
                val.setSeconds(0);
                formik.setFieldValue('fechaInicio', val.toISOString());
              }
            }}
            minDateTime={!product ? new Date() : undefined}
            renderInput={(params: any) =>
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
          <Button onClick={onClose}>{t('form.cancelar')}</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting || !formik.isValid}>
            {product ? t('form.guardar') : t('form.crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BidForm;
