import React, { useState, useEffect } from "react";
import { Card, Typography, Grid, Tooltip, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

// Define all possible achievements (must match MapTree.jsx definitions)
const ALL_ACHIEVEMENTS = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '📚',
  },
  {
    id: 'first_challenge',
    title: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '⭐',
  },
  {
    id: 'three_challenges',
    title: 'Hat Trick',
    description: 'Complete 3 challenges',
    icon: '🎯',
  },
  {
    id: 'atomic_master',
    title: 'Atomic Master',
    description: 'Complete all Atom lessons',
    icon: '⚛️',
  },
  {
    id: 'score_500',
    title: 'Rising Star',
    description: 'Earn 500 points',
    icon: '🌟',
  },
  {
    id: 'score_1000',
    title: 'High Achiever',
    description: 'Earn 1000 points',
    icon: '🏆',
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Earn maximum points (1800)',
    icon: '👑',
  },
  {
    id: 'all_complete',
    title: 'Chemistry Champion',
    description: 'Complete all lessons',
    icon: '🎓',
  },
];

const AchievementsCard = () => {
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user?.userId) {
          const achievements = await AchievementService.getAchievementsByUser(user.userId);
          const earnedIds = new Set(achievements.map(a => a.achievementId || a.id));
          setEarnedAchievements(earnedIds);
          console.log(`🏆 Loaded ${earnedIds.size} achievements for display`);
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // Get the most recent 8 achievements (or show first 8 slots)
  const displayAchievements = ALL_ACHIEVEMENTS.slice(0, 8);

  return (
    <Card
      sx={{
        bgcolor: "#292929",
        color: "white",
        p: 2,
        width: "100%",
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
          textShadow: "0px 0px 5px rgba(255, 64, 129, 0.8)",
          mb: 2,
        }}
      >
        Achievements ({earnedAchievements.size}/{ALL_ACHIEVEMENTS.length})
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography sx={{ color: "#888", fontSize: '0.9em' }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {displayAchievements.map((achievement) => {
            const isUnlocked = earnedAchievements.has(achievement.id);
            
            return (
              <Grid item key={achievement.id}>
                <Tooltip
                  title={
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {achievement.title}
                      </div>
                      <div style={{ fontSize: '0.85em' }}>
                        {achievement.description}
                      </div>
                      {!isUnlocked && (
                        <div style={{ fontSize: '0.75em', marginTop: '4px', color: '#ffeb3b' }}>
                          🔒 Locked
                        </div>
                      )}
                    </div>
                  }
                  arrow
                  placement="top"
                >
                  <div
                    style={{
                      fontSize: '2em',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, filter 0.2s',
                      filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.4)',
                      transform: 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isUnlocked ? (
                      <span style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}>
                        {achievement.icon}
                      </span>
                    ) : (
                      <LockIcon sx={{ fontSize: '1em', color: '#555' }} />
                    )}
                  </div>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!loading && earnedAchievements.size === 0 && (
        <Typography 
          sx={{ 
            textAlign: "center", 
            color: "#888", 
            mt: 2,
            fontSize: '0.9em' 
          }}
        >
          Complete lessons to unlock achievements! 🎯
        </Typography>
      )}
    </Card>
  );
};

export default AchievementsCard;