import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import DiscoveryService from "../services/DiscoveryService";
import UserService from "../services/UserService";
import ScienceIcon from "@mui/icons-material/Science";

const StudentDiscoveryPage = () => {
  const [open, setOpen] = useState(false);
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user && user.userId) {
          // DiscoveryService is mocked locally so it just returns the array or { data: array }
          const response = await DiscoveryService.getCurrentUserDiscoveries(user.userId);
          const data = response.data || response;
          setDiscoveries(data);
        }
      } catch (error) {
        console.error("Failed to fetch discoveries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoveries();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#121212",
        color: "white",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Navbar open={open} />
      <Sidebar
        open={open}
        handleDrawerOpen={() => setOpen(true)}
        handleDrawerClose={() => setOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          marginLeft: open ? "180px" : "60px",
          width: "100%",
          marginTop: "80px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#8bc34a",
            textShadow: "0px 0px 10px rgba(139, 195, 74, 0.8)",
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ScienceIcon fontSize="large" /> Your Discoveries
        </Typography>

        {loading ? (
          <Typography>Loading your lab notes...</Typography>
        ) : discoveries.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h5" sx={{ color: "#aaa", mb: 2 }}>
              You haven't discovered any compounds yet!
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              Head over to the Chemistry Sandbox to start combining elements.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {discoveries.map((disc, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: "#1e1e1e",
                    color: "white",
                    border: "1px solid #8bc34a",
                    boxShadow: "0px 0px 15px rgba(139, 195, 74, 0.2)",
                    transition: "transform 0.2s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 5px 20px rgba(139, 195, 74, 0.6)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#aaffaa", mb: 1 }}>
                      {disc.name || "Unknown Compound"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      Discovered on: {disc.dateDiscovered || new Date().toISOString().split('T')[0]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default StudentDiscoveryPage;
