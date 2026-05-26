package com.elementopia.backend.features.dashboard_visualization;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DomainMasteryDTO {
    private String domainName;
    private double averageAccuracyPercentage;
    private double averageSpeedSeconds;
    private boolean isWeakDomain;
}