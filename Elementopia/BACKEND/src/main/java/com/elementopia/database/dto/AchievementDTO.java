package com.elementopia.database.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AchievementDTO {
    private Long achievementId;
    private String title;
    private String description;
    private LocalDate dateAchieved;
    private String codeName;
    private Long userId;
}

