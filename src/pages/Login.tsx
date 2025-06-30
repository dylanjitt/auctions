
import { Box, Button, CardContent,  Container, TextField } from "@mui/material";
// import { UserContext } from '../context/UserContext';
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { login } from "../services/authService";
import Toast from "../components/Toast";
import { useAuthStore } from "../store/authStore";
import GavelIcon from '@mui/icons-material/Gavel';

const loginSchema = yup.object({
  username: yup
    .string()
    .required("El username es requerido"),
});

function LoginPage () {
  
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage,seterrorMessage]=useState("");

  // const userContext = useContext(UserContext)
  const loginUser = useAuthStore((state) => state.loginUser);

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setLoginError(false); // Reset error state before making request
      
      try {
        const responseLogin = await login(values.username);
        
        if (!responseLogin) {
          console.log("Login failed - no response"); // Debug log
          setLoginError(true);
          seterrorMessage('user not found, try again')
          formik.resetForm();
          return;
        }
        console.log(responseLogin)
        loginUser(responseLogin)
        //userContext?.setUser(responseLogin)

        const dir = responseLogin.rol==='admin'?'/admin':'/home'

        console.log(dir)

       
        navigate(dir, {
          replace: true,
        });
        
      } catch (error) {
        console.error("Login error:", error); 
        setLoginError(true);
        if(error instanceof Error){
          seterrorMessage(error.message)
        }
        formik.resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleToastClose = () => {
    setLoginError(false);
  };

  return (
    <Container maxWidth="xs">
      <Toast
        open={loginError}
        message={errorMessage}
        severity="error"
        onClose={handleToastClose}
      />
      <Box sx={{ marginY: 8 }}>
        <CardContent
          sx={{
            marginTop: 25,
            padding: 4,
            textAlign: "center",
            boxShadow: 3,
            paddingBottom: 12,
            borderRadius: 5
          }}
        >
          <GavelIcon sx={{marginRight:2, width:80,height:80}}/>
          {/* <CardMedia
            component="img"
            height="200"
            image="src/assets/gasolinaYaLogo.png"
            sx={{ objectFit: 'contain' }}
            alt="Gasolina Ya Logo"
          /> */}
          <h1>Subasta Ya</h1>
          
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="input-username-textfield"
              label="Username"
              variant="filled"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              helperText={formik.touched.username && formik.errors.username}
              error={formik.touched.username && Boolean(formik.errors.username)}
              sx={{ marginBottom: 3, borderRadius: 10 }}
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading || !(formik.dirty && formik.isValid)}
              sx={{
                marginTop: 2,
                width: "75%",
                height: '3rem',
                fontSize: '1rem',
                borderRadius: 20,
                backgroundColor: '#1E8BC3',
                fontWeight: '500' 
              }}
              variant="contained"
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <Button
            onClick={() => navigate('/register')}
            disabled={isLoading}
            sx={{
              marginTop: 2,
              width: "75%",
              height: '3rem',
              fontSize: '1rem',
              borderRadius: 20,
              color: '#1E8BC3',
              borderColor: '#1E8BC3',
              borderWidth: 2
            }}
            variant="outlined"
          >
            Crear Cuenta
          </Button>
        </CardContent>
      </Box>
    </Container>
  );
}

export default LoginPage