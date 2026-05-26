package com.elementopia.backend.features.matchmaking_lobby;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/matchmaking")
public class MatchmakingController {

    private final RoomManagerService roomManagerService;

    public MatchmakingController(RoomManagerService roomManagerService) {
        this.roomManagerService = roomManagerService;
    }

    @PostMapping("/host")
    public ResponseEntity<?> hostNewMatch(@RequestBody Map<String, String> payload) {
        String hostNickname = payload.get("nickname");

        if (hostNickname == null || hostNickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Host nickname is required.");
        }

        MatchSession lobby = roomManagerService.createLobby(hostNickname);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "roomCode", lobby.getRoomCode(),
                "message", "Lobby created successfully. Waiting for opponent."
        ));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinExistingMatch(@RequestBody Map<String, String> payload) {
        String guestNickname = payload.get("nickname");
        String roomCode = payload.get("roomCode");

        if (guestNickname == null || roomCode == null) {
            return ResponseEntity.badRequest().body("Nickname and Room Code are required.");
        }

        boolean joinedSuccessfully = roomManagerService.joinLobby(roomCode, guestNickname);

        if (joinedSuccessfully) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Joined lobby successfully. Preparing match.",
                    "action", "LAUNCH_MULTIPLAYER_ARENA"
            ));
        }

        return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "message", "Room not found or already full."
        ));
    }
}