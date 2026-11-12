package com.elementopia.backend.features.performance_logging;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "pretest_diagnostic")
public class PreTestDiagnostic {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Setter
    @Column(name = "session_nickname", nullable = false)
    private String sessionNickname;

    @Setter
    @Column(name = "score", nullable = false)
    private int score;

    @Setter
    @Column(name = "total", nullable = false)
    private int total;

    @Setter
    @Column(name = "percentage", nullable = false)
    private int percentage;

    @Setter
    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @Setter
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public PreTestDiagnostic() {
        this.createdAt = Instant.now();
    }

    public PreTestDiagnostic(String sessionNickname, int score, int total, int percentage, String answersJson) {
        this();
        this.sessionNickname = sessionNickname;
        this.score = score;
        this.total = total;
        this.percentage = percentage;
        this.answersJson = answersJson;
    }
}
