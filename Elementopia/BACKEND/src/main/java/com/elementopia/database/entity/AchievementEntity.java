package com.elementopia.database.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist; // <--- ADDED THIS IMPORT
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "achievement")
@Data
public class AchievementEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "date_achieved", nullable = false)
    private LocalDate dateAchieved;
    
    @Column(name = "code_name")
    private String codeName;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserEntity user;

    // --- THE FIX IS HERE ---
    @PrePersist
    protected void onCreate() {
        if (dateAchieved == null) {
            dateAchieved = LocalDate.now(); // Sets the date automatically
        }
    }
}