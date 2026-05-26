package com.elementopia.backend.features.matchmaking_lobby;

import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Random;

@Service
public class RoomManagerService {

    private final MatchSessionRepository sessionRepository;

    // Alphanumeric pool excluding confusing characters (like 0 and O, 1 and I)
    private static final String CODE_POOL = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public RoomManagerService(MatchSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public MatchSession createLobby(String hostNickname) {
        String generatedCode = generateUniqueRoomCode();
        MatchSession newSession = new MatchSession(generatedCode, hostNickname);
        return sessionRepository.save(newSession);
    }

    public boolean joinLobby(String roomCode, String guestNickname) {
        Optional<MatchSession> sessionOpt = sessionRepository.findById(roomCode.toUpperCase());

        if (sessionOpt.isPresent()) {
            MatchSession session = sessionOpt.get();

            // Verify the room is actually waiting for a second player
            if ("WAITING".equals(session.getStatus()) && session.getGuestNickname() == null) {
                session.setGuestNickname(guestNickname);
                session.setStatus("IN_PROGRESS");
                sessionRepository.save(session);
                return true;
            }
        }
        return false;
    }

    private String generateUniqueRoomCode() {
        Random random = new Random();
        StringBuilder code;

        // Loop ensures we don't accidentally generate a code that is already active
        do {
            code = new StringBuilder(5);
            for (int i = 0; i < 5; i++) {
                code.append(CODE_POOL.charAt(random.nextInt(CODE_POOL.length())));
            }
        } while (sessionRepository.existsById(code.toString()));

        return code.toString();
    }
}