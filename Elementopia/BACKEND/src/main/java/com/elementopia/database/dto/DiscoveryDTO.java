package com.elementopia.database.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DiscoveryDTO {
    private String name;
    private LocalDate dateDiscovered;
}
