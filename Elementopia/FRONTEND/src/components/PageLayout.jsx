import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Navbar from "../NavBar";
import Sidebar from "../Sidebar";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const PageLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", color: "white", minHeight: "100vh", width: "100vw" }}>
    <Navbar open={open} />
    <Sidebar open={open} handleDrawerOpen={() => setOpen(true)} handleDrawerClose={() => setOpen(false)} />
    <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? "180px" : "60px", width: "100%", marginTop: "80px" }}>
      <Typography>this is page layout</Typography>
      <Outlet />
    </Box>
  </Box>
  );
};

export default PageLayout;
