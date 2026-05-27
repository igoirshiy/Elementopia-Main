package com.elementopia.backend.features.learning_progression;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class ProgressionValidationService {

    private static final Logger logger = Logger.getLogger(ProgressionValidationService.class.getName());
    private final RoomCompletionStateRepository repository;

    // Core SDD Constraint: 3 reactions required to unlock advanced chambers
    private static final int MIN_REACTIONS_REQUIRED = 3;

    public ProgressionValidationService(RoomCompletionStateRepository repository) {
        this.repository = repository;
    }

    public boolean verifyRoomAccess(String nicknameWithTag, int roomId) {
        long startTime = System.currentTimeMillis();

        try {
            // Room 1 is the foundational element room. It is always unlocked.
            if (roomId <= 1) {
                return true;
            }

            // For advanced rooms (roomId > 1), verify historical completion milestones
            Integer totalReactions = repository.getTotalCorrectReactions(nicknameWithTag);
            if (totalReactions == null) {
                totalReactions = 0;
            }

            long endTime = System.currentTimeMillis();
            logger.info("Progression check executed in: " + (endTime - startTime) + "ms");

            return totalReactions >= MIN_REACTIONS_REQUIRED;

        } catch (Exception e) {
            logger.severe("Database validation failure during progression check: " + e.getMessage());
            return false; // Fail secure: Lock room if database cannot be reached
        }
    }

    public void logRoomCompletion(String nicknameWithTag, int roomId, int correctReactions) {
        try {
            RoomCompletionState state = new RoomCompletionState();
            state.setSessionNickname(nicknameWithTag);
            state.setRoomId(roomId);
            state.setCorrectReactionCount(correctReactions);
            state.setCompleted(correctReactions >= MIN_REACTIONS_REQUIRED);
            repository.save(state);
            logger.info("Progression logged for " + nicknameWithTag + " in room " + roomId);
        } catch (Exception e) {
            logger.warning("Failed to log room completion: " + e.getMessage());
        }
    }
}