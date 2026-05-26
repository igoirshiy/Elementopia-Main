package com.elementopia.backend.features.disconnection_fallback;

import com.elementopia.backend.features.matchmaking_lobby.MatchSession;
import com.elementopia.backend.features.matchmaking_lobby.MatchSessionRepository;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class MatchTerminationService {

    private static final Logger logger = Logger.getLogger(MatchTerminationService.class.getName());

    private final MatchSessionRepository sessionRepository;
    private final SimpMessageSendingOperations messagingTemplate;

    public MatchTerminationService(MatchSessionRepository sessionRepository, SimpMessageSendingOperations messagingTemplate) {
        this.sessionRepository = sessionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void terminateMatch(String roomCode, String droppedPlayerNickname) {
        Optional<MatchSession> sessionOpt = sessionRepository.findById(roomCode.toUpperCase());

        if (sessionOpt.isPresent()) {
            MatchSession session = sessionOpt.get();

            // Only process the abort sequence if the match is still active
            if ("IN_PROGRESS".equals(session.getStatus()) || "WAITING".equals(session.getStatus())) {

                // 1. Mark the database record as aborted so no one else can join it
                session.setStatus("ABORTED");
                sessionRepository.save(session);

                logger.warning("Match [" + roomCode + "] aborted. Player disconnected: " + droppedPlayerNickname);

                // 2. Broadcast the emergency cancellation to the WebSocket channel
                DisconnectPayload alert = new DisconnectPayload(
                        roomCode,
                        droppedPlayerNickname,
                        "Opponent disconnected. The match has been annulled.",
                        true
                );

                messagingTemplate.convertAndSend("/topic/match/" + roomCode, alert);
            }
        }
    }
}