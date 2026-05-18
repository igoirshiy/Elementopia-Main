import React from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom"; 
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import home from "../assets/img/home.png";
import career from "../assets/img/career.png";
import discovery from "../assets/img/discovery.png";
import chemSimulation from "../assets/img/chemSimulation.png"

const drawerWidth = 180;
const closedWidth = 60;

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: open ? drawerWidth : closedWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : closedWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    backgroundColor: "#222",
    color: "#fff",
  },
}));

const menuItems = [
  { text: "Home", icon: home, path: "/student-home-page" },
  { text: "Chem-Simulation", icon: chemSimulation, path: "/student/Chem-Simulation" },
];

const Sidebar = ({ open, handleDrawerOpen, handleDrawerClose }) => {
  const location = useLocation(); // ✅ Get current route

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar sx={{ display: "flex", justifyContent: open ? "space-between" : "center", paddingX: 2 }}>
        {open ? (
          <>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>Menu</Typography>
            <IconButton onClick={handleDrawerClose} sx={{ color: "#fff" }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={handleDrawerOpen} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: "#555" }} />

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path; // ✅ Check active
          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor: isActive ? "#444" : "transparent", // ✅ Highlight active
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", mr: open ? 2 : "auto", color: "#fff" }}>
                  <img src={item.icon} alt={item.text} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, color: "#fff" }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;