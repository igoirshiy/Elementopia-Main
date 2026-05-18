package com.elementopia.database.dto;

import lombok.Data;

@Data
public class JoinSectionRequest {
    private Long studentId;
    private String sectionCode;
}
