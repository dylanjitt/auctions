import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { uploadToCloudinary } from "../util/uploader";
import { useCallback, useState } from "react";

const registerSchema = yup.object({
  username: yup.string().required("El username es requerido"),
  //rol: yup.string().oneOf(["admin", "user"]).required("El rol es requerido"),
  avatar: yup.string()
  //.url("Debe ser una URL válida")
  .nullable(),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      username: "",
      
      avatar: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        await userService.createUser({...values,rol:'user'});
        alert("Usuario registrado con éxito");
        navigate("/login");
      } catch (error) {
        console.error("Error al registrar:", error);
        alert("Error al registrar. Revisa consola.");
      }
    }
  });

  // const handleFileUpload = async (file: File) => {
  //   try {
  //     const imageUrl = await uploadToCloudinary(file);
  //     formik.setFieldValue("avatar", imageUrl);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     alert("Error al subir la imagen");
  //   }
  // };
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploading(true);
  
      // preview...
      const reader = new FileReader();
      reader.onload = e => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
  
      // actual upload:
      const imageUrl = await uploadToCloudinary(file);
      formik.setFieldValue("avatar", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginY: 8 }}>
        <CardContent
          sx={{
            marginTop: 25,
            padding: 4,
            textAlign: "center",
            boxShadow: 3,
            paddingBottom: 12,
            borderRadius: 5,
          }}
        >

          <h1>Crear Cuenta</h1>


          <form onSubmit={formik.handleSubmit}>
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              variant="filled"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              helperText={formik.touched.username && formik.errors.username}
              error={
                formik.touched.username && Boolean(formik.errors.username)
              }
              sx={{ marginBottom: 3 }}
            />

            {/* Role */}
            {/* <Select
              fullWidth
              displayEmpty
              variant="filled"
              name="rol"
              value={formik.values.rol}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rol && Boolean(formik.errors.rol)}
              sx={{ marginBottom: 3 }}
            >
              <MenuItem value="" disabled>
                Selecciona un rol
              </MenuItem>
              <MenuItem value="user">Usuario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
            {formik.touched.rol && formik.errors.rol && (
              <Typography variant="caption" color="error">
                {formik.errors.rol}
              </Typography>
            )} */}

            {/* Avatar URL */}
            {/* <TextField
              fullWidth
              label="Avatar URL (opcional)"
              variant="filled"
              name="avatar"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.avatar}
              helperText={formik.touched.avatar && formik.errors.avatar}
              error={formik.touched.avatar && Boolean(formik.errors.avatar)}
              sx={{ marginBottom: 3 }}
            /> */}
            {/* Avatar Upload */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: "2px dashed #1E8BC3",
                borderRadius: 2,
                padding: 2,
                textAlign: "center",
                marginBottom: 3,
                cursor: "pointer",
                backgroundColor: "#f8f8f8",
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isUploading ? (
                <CircularProgress />
              ) : previewImage || formik.values.avatar ? (
                <img
                  src={previewImage || formik.values.avatar}
                  alt="Avatar preview"
                  style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: "50%",
                    objectFit: "cover" 
                  }}
                />
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Arrastra y suelta tu imagen aquí
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    O haz clic para seleccionar
                  </Typography>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="avatar-upload">
                <Button
                  component="span"
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  {previewImage || formik.values.avatar ? "Cambiar imagen" : "Seleccionar imagen"}
                </Button>
              </label>
            </Box>


            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                height: "3rem",
                fontSize: "1rem",
                borderRadius: 20,
                backgroundColor: "#1E8BC3",
              }}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Registrarse
            </Button>
          </form>

          <Button
            onClick={() => navigate("/login")}
            fullWidth
            variant="outlined"
            sx={{
              marginTop: 2,
              height: "3rem",
              fontSize: "1rem",
              borderRadius: 20,
              color: "#1E8BC3",
              borderColor: "#1E8BC3",
              borderWidth: 2,
            }}
          >
            Volver al Login
          </Button>
        </CardContent>
      </Box>
    </Container>
  );
}

export default RegisterPage;
