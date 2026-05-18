package com.elementopia.database.dto;

public record UserSummaryDto(
        Long userId,
        String firstName,
        String lastName,
        Integer careerTotalScore
) {}
