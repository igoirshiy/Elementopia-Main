package com.elementopia.database.dto;

import lombok.Data;
import java.util.List;

@Data
public class LabCreateRequest {
    private String laboratoryName;
    private String labCode;
    private String lesson;
    private Long creatorId;
    private List<Long> studentIds;
    private List<Long> lessonIds;
}