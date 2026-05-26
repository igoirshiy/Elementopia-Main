package com.elementopia.backend.features.disconnection_fallback;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DisconnectPayload {
    private String roomCode;
    private String disconnectedUser;
    private String message;
    private boolean matchAborted;
}