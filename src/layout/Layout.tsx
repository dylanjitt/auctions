import { Box, Toolbar } from "@mui/material";
import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {

  return (
    <Box sx={{ display: "flex" }}>

        <Box sx={{ flexGrow: 1 ,width:"100%", display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <NavBar />
          <Box component="main" sx={{ p: 3, maxWidth:1920, display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
    </Box>
  );
};