package com.elementopia.backend.features.realtime_sync;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.logging.Logger;

@Controller
public class MatchSyncController {

    private static final Logger logger = Logger.getLogger(MatchSyncController.class.getName());

    /**
     * React Client sends to: /app/match/{roomCode}/sync
     * Spring Broadcasts to: /topic/match/{roomCode}
     */
    @MessageMapping("/match/{roomCode}/sync")
    @SendTo("/topic/match/{roomCode}")
    public MatchStatePayload syncPlayerProgress(
            @DestinationVariable String roomCode,
            @Payload MatchStatePayload payload) {

        // You can add validation logic here (e.g., verifying the score isn't impossible)
        // For maximum speed in Module 3.2, we act as a pure, ultra-fast relay.

        logger.info(String.format("Live sync: Room [%s] | Player [%s] scored! Current Score: %d",
                roomCode, payload.getSenderNickname(), payload.getCurrentScore()));

        // Whatever is returned here is instantly broadcast to everyone subscribed to /topic/match/{roomCode}
        return payload;
    }
}