package com.elementopia.database.dto;

import lombok.Data;

@Data
public class ScoreDTO {
    private String percentage;
    private int score;
    private Long lessonId;
}
