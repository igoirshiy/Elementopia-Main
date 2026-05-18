import React from "react";
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

const lessons = [
  { title: "Chemistry", progress: 75 },
  { title: "Physics", progress: 50 },
  { title: "Biology", progress: 40 },
];

const LessonCards = () => {
  return (
    <Grid container spacing={2} sx={{ mb: 3, width: "100%", marginTop: "10px" }}>
      {lessons.map((lesson, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              bgcolor: "#292929",
              color: "white",
              border: "2px solid #00bcd4",
              boxShadow: "0px 0px 15px rgba(0, 188, 212, 0.6)",
              transition: "transform 0.2s, box-shadow 0.3s",
              borderRadius: "8px",
              "&:hover": {
                boxShadow: "0px 0px 20px rgba(0, 188, 212, 1)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  textShadow: "0px 0px 5px rgba(0, 188, 212, 0.8)",
                  textAlign: "center",
                }}
              >
                {lesson.title}
              </Typography>
              <Box sx={{ position: "relative", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={lesson.progress}
                  sx={{ height: 20, borderRadius: 5, backgroundColor: "#555" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {lesson.progress}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LessonCards;
