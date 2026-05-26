package com.elementopia.backend.features.matchmaking_lobby;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "MATCH_SESSION")
@Getter
@Setter
@NoArgsConstructor
public class MatchSession {

    @Id
    @Column(name = "room_code", length = 6, nullable = false)
    private String roomCode;

    @Column(name = "host_nickname", nullable = false)
    private String hostNickname;

    @Column(name = "guest_nickname")
    private String guestNickname;

    @Column(name = "status", nullable = false)
    private String status; // e.g., "WAITING", "IN_PROGRESS", "COMPLETED"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public MatchSession(String roomCode, String hostNickname) {
        this.roomCode = roomCode;
        this.hostNickname = hostNickname;
        this.status = "WAITING";
        this.createdAt = LocalDateTime.now();
    }
}