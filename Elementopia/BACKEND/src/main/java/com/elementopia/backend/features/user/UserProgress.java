package com.elementopia.backend.features.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
public class UserProgress {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "nickname", length = 50, nullable = false, unique = true)
    private String nickname;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "wins")
    private Integer wins;

    @Column(name = "losses")
    private Integer losses;

    @Column(name = "cleared_domains", length = 2000)
    private String clearedDomains;

    @Column(name = "sessions_json", columnDefinition = "TEXT")
    private String sessionsJson;

    public UserProgress() {
        this.id = UUID.randomUUID().toString();
        this.rating = 1200;
        this.wins = 0;
        this.losses = 0;
        this.clearedDomains = "";
        this.sessionsJson = "[]";
    }

    public UserProgress(String nickname) {
        this();
        this.nickname = nickname;
    }
}
