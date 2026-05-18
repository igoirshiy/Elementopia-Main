package com.elementopia.database.dto;

import lombok.Data;

@Data
public class CreateSectionRequest {
    private String sectionName;
    private String sectionCode;
    private Long teacherId;
}
