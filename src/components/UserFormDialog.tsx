import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { User } from '../interfaces/userInterface';
import { uploadToCloudinary } from '../util/uploader';
import { useTranslation } from 'react-i18next';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  rol: yup.string().oneOf(['admin','user']).required('Role is required'),
  avatar: yup.string().nullable(),
});

interface Props {
  open: boolean;
  initialData?: User;
  onClose: () => void;
  onSave: (data: Omit<User,'id'>, id?: string) => void;
}
export function UserFormDialog({ open, initialData, onClose, onSave }: Props) {

  const { t } = useTranslation();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik<Omit<User,'id'>>({
    initialValues: {
      username: initialData?.username || '',
      rol: initialData?.rol || 'user',
      avatar: initialData?.avatar || '',
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: values => {
      onSave(values, initialData?.id);
      onClose();
    }
  });

  // When initialData changes, set preview to existing avatar
  useEffect(() => {
    setPreviewImage(initialData?.avatar || null);
  }, [initialData]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploading(true);

      // preview local
      const reader = new FileReader();
      reader.onload = e => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);

      // upload
      const url = await uploadToCloudinary(file);
      formik.setFieldValue('avatar', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
  {initialData ? t('userForm.title.edit') : t('userForm.title.new')}
</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label={t('userForm.fields.username')}
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <Select
            fullWidth
            margin="dense"
            name="rol"
            value={formik.values.rol}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.rol && Boolean(formik.errors.rol)}
          >
            <MenuItem value="user">{t('userForm.fields.user')}</MenuItem>
            <MenuItem value="admin">{t('userForm.fields.admin')}</MenuItem>
          </Select>
          {formik.touched.rol && formik.errors.rol && (
            <Typography variant="caption" color="error">
              {formik.errors.rol}
            </Typography>
          )}

          {/* Drag & Drop Avatar */}
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: '2px dashed #1E8BC3',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              my: 2,
              cursor: 'pointer',
              backgroundColor: '#f8f8f8',
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {isUploading ? (
              <CircularProgress />
            ) : previewImage ? (
              <img
                src={previewImage}
                alt="Avatar preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                {t('userForm.upload.dropHere')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                {t('userForm.upload.clickToSelect')}
                </Typography>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              style={{ display: 'none' }}
              onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <label htmlFor="avatar-upload">
              <Button component="span" variant="outlined">
              {previewImage ? t('userForm.upload.changeImage') : t('userForm.upload.selectImage')}
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
        <Button onClick={onClose}>{t('userForm.actions.cancel')}</Button>
        <Button type="submit">{t('userForm.actions.save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
