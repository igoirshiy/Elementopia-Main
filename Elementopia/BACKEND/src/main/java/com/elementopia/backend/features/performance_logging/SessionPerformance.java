package com.elementopia.backend.features.performance_logging;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "SESSION_PERFORMANCE")
public class SessionPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "performance_id", nullable = false)
    private UUID performanceId;

    @Setter
    @Column(name = "session_nickname", nullable = false)
    private String sessionNickname;

    @Setter
    @Column(name = "domain_id", length = 50, nullable = false)
    private String domainId;

    @Setter
    @Column(name = "completion_speed_seconds", nullable = false)
    private double completionSpeedSeconds;

    @Setter
    @Column(name = "compound_accuracy_percentage", nullable = false)
    private double compoundAccuracyPercentage;

    @Setter
    @Column(name = "reaction_path_efficiency", nullable = false)
    private double reactionPathEfficiency;

    @Column(name = "logged_at", nullable = false)
    private Instant loggedAt;

    public SessionPerformance() {
        this.loggedAt = Instant.now();
    }

    public SessionPerformance(String sessionNickname, String domainId, double completionSpeedSeconds,
                                    double compoundAccuracyPercentage, double reactionPathEfficiency) {
        this();
        this.sessionNickname = sessionNickname;
        this.domainId = domainId;
        this.completionSpeedSeconds = completionSpeedSeconds;
        this.compoundAccuracyPercentage = compoundAccuracyPercentage;
        this.reactionPathEfficiency = reactionPathEfficiency;
    }
}