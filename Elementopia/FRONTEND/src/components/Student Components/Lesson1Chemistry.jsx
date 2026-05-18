import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, List, ListItem, Collapse, IconButton, LinearProgress } from "@mui/material";
import { ExpandLess, ExpandMore, Star, Lock } from "@mui/icons-material";

const curriculum = [
  {
    topic: "Electronic Structure of Matter",
    subtopics: ["Ionic and Covalent Bonding", "Metallic Bonding"],
  },
  {
    topic: "The Variety of Carbon Compounds",
    subtopics: ["Carbon Atoms", "Organic Compounds"],
  },
  {
    topic: "MOLE CONCEPT",
    subtopics: ["Mass", "Moles", "Percentage Composition of a Compound"],
  },
];

export default function ChemistryCurriculum() {
  const [openTopic, setOpenTopic] = useState(null);

  return (
    <Box sx={{ display: "flex", bgcolor: "#0d1117", color: "white", minHeight: "100vh", width: "100vw", padding: 4 }}>
      {/* Left Side - Lessons */}
      <Box sx={{ flex: 2, paddingRight: 4, maxWidth: "75%" }}>
        <Card sx={{ mt: 2, bgcolor: "#1e1e2e", color: "white", borderRadius: 3, boxShadow: "0px 4px 10px rgba(255, 152, 0, 0.4)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              CHEMISTRY
            </Typography>
            <Typography variant="body2" mt={1}>
              Explore matter, atoms, and the periodic table through fun, interactive lessons!
            </Typography>
            <Button variant="contained" sx={{ mt: 2, bgcolor: "#ff9800", color: "black", fontWeight: "bold", borderRadius: 2, '&:hover': { bgcolor: "#ffb74d" } }}>
              Start Learning
            </Button>
          </CardContent>
        </Card>

        {/* Curriculum */}
        <Box mt={4}>
          {curriculum.map((item, index) => (
            <Card key={index} sx={{ mb: 2, bgcolor: "#1e1e2e", borderRadius: 2, boxShadow: "0px 4px 6px rgba(255, 152, 0, 0.4)", color: "#f5f5f5" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" onClick={() => setOpenTopic(openTopic === index ? null : index)} sx={{ cursor: "pointer" }}>
                  <Typography variant="h6">{item.topic}</Typography>
                  <IconButton>{openTopic === index ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}</IconButton>
                </Box>
                <Collapse in={openTopic === index} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 2 }}>
                    {item.subtopics.map((subtopic, subIndex) => (
                      <ListItem key={subIndex} sx={{ color: "#b0bec5" }}>
                        {subtopic}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Side - Progress and Achievements */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, maxWidth: "15%", marginTop: "15px"}}>
        <Card sx={{ bgcolor: "#1e1e2e", borderRadius: 3, boxShadow: "0px 4px 6px rgba(255, 152, 0, 0.4)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#f5f5f5"}} >Progress</Typography>
            <Typography variant="body2" sx={{ color: "#f5f5f5"}} >Topic Completion</Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: "#424242", height: 10, borderRadius: 5 }} />
            <Typography variant="body2" mt={1} sx={{ color: "#f5f5f5"}}>Exercises</Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: "#424242", height: 10, borderRadius: 5 }} />
            <Typography variant="body2" mt={1} sx={{ color: "#f5f5f5"}}>EXP Earned</Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: "#424242", height: 10, borderRadius: 5 }} />
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "#1e1e2e", borderRadius: 3, boxShadow: "0px 4px 6px rgba(255, 152, 0, 0.4)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#f5f5f5"}}>Achievement</Typography>
            <Box display="flex" justifyContent="center" gap={1} mt={1}>
              {[...Array(6)].map((_, i) => (
                <Star key={i} sx={{ color: "#ff9800" }} />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "#1e1e2e", borderRadius: 3, boxShadow: "0px 4px 6px rgba(255, 152, 0, 0.4)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#f5f5f5"}} >Discovery</Typography>
            <Box display="flex" justifyContent="center" gap={1} mt={1}>
              {[...Array(4)].map((_, i) => (
                <Lock key={i} sx={{ color: "#ff9800" }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}