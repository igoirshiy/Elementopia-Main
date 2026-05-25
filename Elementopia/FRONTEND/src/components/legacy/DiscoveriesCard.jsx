import React, { useState, useEffect } from "react";
import { Card, Typography, Grid, Button, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ScienceIcon from "@mui/icons-material/Science";
import { useNavigate } from "react-router-dom";
import DiscoveryService from '@/services/DiscoveryService';
import UserService from '@/services/UserService';

const DiscoveriesCard = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user && user.userId) {
          const response = await DiscoveryService.getCurrentUserDiscoveries(user.userId);
          const data = response.data || response;
          setDiscoveries(data);
        }
      } catch (error) {
        console.error("Failed to fetch discoveries:", error);
      }
    };
    fetchDiscoveries();
  }, []);

  // Prepare exactly 6 slots for the grid
  const displaySlots = Array(6).fill(null).map((_, index) => {
    return discoveries[index] || null;
  });

  return (
    <Card
      sx={{
        bgcolor: "#292929",
        marginTop: "20px",
        color: "white",
        p: 2,
        width: "100%",
        mb: 2,
        border: "2px solid #8bc34a",
        borderRadius: '10px',
        boxShadow: "0px 0px 15px rgba(139, 195, 74, 0.6)",
        transition: "transform 0.2s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0px 0px 20px rgba(139, 195, 74, 1)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            textShadow: "0px 0px 5px rgba(139, 195, 74, 0.8)",
          }}
        >
          Recent Discoveries
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => navigate('/student/discovery')}
          sx={{ 
            color: "#8bc34a", 
            borderColor: "#8bc34a",
            "&:hover": { bgcolor: "rgba(139, 195, 74, 0.1)", borderColor: "#8bc34a" }
          }}
        >
          View All
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {displaySlots.map((disc, index) => (
          <Grid item xs={4} sm={2} key={index} sx={{ display: "flex", justifyContent: "center" }}>
            {disc ? (
              <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ScienceIcon sx={{ color: "#aaffaa", fontSize: 32 }} />
                <Typography variant="caption" sx={{ color: "#aaffaa", mt: 0.5, display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {disc.name.substring(0, 6)}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.5 }}>
                <LockIcon sx={{ fontSize: 32 }} />
                <Typography variant="caption" sx={{ mt: 0.5 }}>Locked</Typography>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default DiscoveriesCard;
