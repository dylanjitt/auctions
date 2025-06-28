import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "../pages/Login"
import { RoleGuard } from "../guards/RoleGuard"
import Home from "../pages/Home"
import AdminPanel from "../pages/AdminPanel"

export const AppRoutes = () =>{
  return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<></>/* TODO: add Register page */} />

        {/* Ruta protegida para usuarios con rol "user" */}
        <Route
          path="/home"
          element={
            <RoleGuard allowedRoles={['user']}>
              <Home />
            </RoleGuard>
          }
        />

        {/* Ruta protegida solo para administradores */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminPanel />
            </RoleGuard>
          }
        />

    </Routes>
    </BrowserRouter>
  )
}