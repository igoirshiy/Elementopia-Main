package com.elementopia.backend.features.realtime_sync;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchStatePayload {
    private String roomCode;
    private String senderNickname;
    private int currentScore;
    private String lastSolvedCompound; // e.g., "H2O" - to show a pop-up on the opponent's screen
    private boolean isFinished; // Triggers the end-game sequence (Module 2.3)
}