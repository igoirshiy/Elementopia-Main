import React from "react";
import { Card, Typography, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const discoveries = Array(6).fill(false);

const DiscoveriesCard = () => {
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
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {discoveries.map((unlocked, index) => (
          <Grid item key={index}>
            {unlocked ? <Typography>✅</Typography> : <LockIcon />}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default DiscoveriesCard;
