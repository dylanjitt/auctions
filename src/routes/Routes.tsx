import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "../pages/Login"
import { RoleGuard } from "../guards/RoleGuard"
import Home from "../pages/Home"
import AdminPanel from "../pages/AdminPanel"
import AuthGuard from "../guards/AuthGuard"
import { Layout } from "../layout/Layout"
import AuctionRoom from "../pages/AuctionRoom"
import UserAdmin from "../pages/UserAdmin"
import RegisterPage from "../pages/RegisterUser"
import BidHistory from "../pages/BidHistory"
import { RoleBasedRedirect } from "./RoleBasedRedirect"
import { useAuthStore } from "../store/authStore"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/login" element={useAuthStore.getState().isAuthenticated?
          <Navigate to="/" replace/> : <LoginPage/>
        } />
        {/* <Route path="/login" element={<LoginPage/>} />  */}
        <Route path="/register" element={<RegisterPage/>} /> 

        <Route element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }>
          {/* Role: USER */}
          <Route element={<RoleGuard allowedRoles={['user']} />}>
            <Route path="/home" >
              <Route index element={<Home />} />
              <Route path="auction/:id" element={<AuctionRoom />} />
              <Route path="bidHistory" element={<BidHistory/>}/>
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Route>

          {/* Role: ADMIN */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route path="/admin">
              <Route index element={<AdminPanel />} />
              <Route path="userAdmin" element={<UserAdmin />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Route>



      </Routes>
    </BrowserRouter>
  )
}