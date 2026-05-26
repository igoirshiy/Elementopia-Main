package com.elementopia.backend.features.learning_progression;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ROOM_COMPLETION_STATE", indexes = {
        @Index(name = "idx_progression_nickname", columnList = "session_nickname")
})
@Getter
@Setter
public class RoomCompletionState {

    @Id
    @Column(name = "completion_id", length = 36, nullable = false)
    private String completionId;

    @Column(name = "room_id", nullable = false)
    private int roomId;

    @Column(name = "session_nickname", nullable = false)
    private String sessionNickname;

    @Column(name = "correct_reaction_count", nullable = false)
    private int correctReactionCount;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    public RoomCompletionState() {
        this.completionId = UUID.randomUUID().toString();
        this.completedAt = LocalDateTime.now();
    }

}