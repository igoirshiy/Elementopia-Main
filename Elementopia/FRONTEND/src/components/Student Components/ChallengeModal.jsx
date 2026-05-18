import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ChallengeModal = ({ open, onClose, compoundName }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="challenge-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" id="challenge-modal-title">
          Congratulations!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          You've discovered the {compoundName} compound!
        </Typography>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ChallengeModal;
