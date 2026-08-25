package com.elementopia.backend.features.learning_progression;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class ProgressionValidationService {

    private static final Logger logger = Logger.getLogger(ProgressionValidationService.class.getName());
    private final RoomCompletionStateRepository repository;
    private static final int MIN_REACTIONS_REQUIRED = 14;

    public ProgressionValidationService(RoomCompletionStateRepository repository) {
        this.repository = repository;
    }

    public boolean verifyRoomAccess(String nicknameWithTag, int roomId) {
        long startTime = System.currentTimeMillis();

        try {
            if (roomId <= 1) {
                return true;
            }

            Integer totalReactions = repository.getTotalCorrectReactions(nicknameWithTag);
            if (totalReactions == null) {
                totalReactions = 0;
            }

            int requiredReactions = (roomId - 1) * MIN_REACTIONS_REQUIRED;
            long endTime = System.currentTimeMillis();
            logger.info("Progression check executed in: " + (endTime - startTime) + "ms");

            return totalReactions >= requiredReactions;

        } catch (Exception e) {
            logger.severe("Database validation failure during progression check: " + e.getMessage());
            return false;
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

    public void resetRoomCompletion(String nicknameWithTag) {
        try {
            repository.deleteBySessionNickname(nicknameWithTag);
            logger.info("Room completion reset for: " + nicknameWithTag);
        } catch (Exception e) {
            logger.warning("Failed to reset room completion: " + e.getMessage());
        }
    }

}