package com.elementopia.database.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class LabResponse {
    private Long labId;
    private String laboratoryName;
    private List<String> lessonTitles;
}