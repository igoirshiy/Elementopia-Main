package com.elementopia.backend.features.match_consolidation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "STUDENT_PROFICIENCY")
@Getter
@Setter
@NoArgsConstructor
public class StudentProficiencyEntity {

    @Id
    @Column(name = "session_nickname", length = 100, nullable = false)
    private String sessionNickname;

    @Column(name = "elo_rating", nullable = false)
    private int eloRating;

    @Column(name = "total_matches_played", nullable = false)
    private int totalMatchesPlayed;

    @Column(name = "wins", nullable = false)
    private int wins;

    @Column(name = "losses", nullable = false)
    private int losses;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public StudentProficiencyEntity(String sessionNickname) {
        this.sessionNickname = sessionNickname;
        this.eloRating = 1000; // Baseline starting ELO for all new students
        this.totalMatchesPlayed = 0;
        this.wins = 0;
        this.losses = 0;
        this.lastUpdated = LocalDateTime.now();
    }
}