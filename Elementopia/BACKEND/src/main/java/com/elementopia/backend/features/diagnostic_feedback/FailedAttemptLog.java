package com.elementopia.backend.features.diagnostic_feedback;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "FAILED_ATTEMPT_LOG", indexes = {
        @Index(name = "idx_session_nickname", columnList = "session_nickname")
})
@Getter
@Setter
public class FailedAttemptLog {

    @Id
    @Column(name = "attempt_id", length = 36, nullable = false)
    private String attemptId;

    @Column(name = "message_id")
    private String messageId;

    // Matches the "session_nickname" requirement exactly from your plan
    @Column(name = "session_nickname", nullable = false)
    private String sessionNickname;

    @Column(name = "submission_string", nullable = false)
    private String submissionString;

    @Column(name = "error_timestamp", nullable = false)
    private LocalDateTime errorTimestamp;

    // Constructors
    public FailedAttemptLog() {
        this.attemptId = UUID.randomUUID().toString();
        this.errorTimestamp = LocalDateTime.now();
    }

    public FailedAttemptLog(String sessionNickname, String submissionString, String messageId) {
        this();
        this.sessionNickname = sessionNickname;
        this.submissionString = submissionString;
        this.messageId = messageId;
    }

}