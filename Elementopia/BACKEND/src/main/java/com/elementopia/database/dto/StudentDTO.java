package com.elementopia.database.dto;

import com.elementopia.database.entity.SectionEntity;
import lombok.Data;

@Data
public class StudentDTO {
    private Long studentId;
    private String firstName;
    private String lastName;
    private SectionEntity section;
}
