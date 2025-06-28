import { Box, Toolbar } from "@mui/material";
import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {

  return (
    <Box sx={{ display: "flex" }}>

        <Box sx={{ flexGrow: 1 }}>
          <NavBar />
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
    </Box>
  );
};