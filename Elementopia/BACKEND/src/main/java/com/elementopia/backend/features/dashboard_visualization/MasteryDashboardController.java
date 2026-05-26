package com.elementopia.backend.features.dashboard_visualization;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features/mastery")
public class MasteryDashboardController {

    private final MasteryAggregationService aggregationService;

    public MasteryDashboardController(MasteryAggregationService aggregationService) {
        this.aggregationService = aggregationService;
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<?> getPersonalProficiencyMap(@PathVariable("nickname") String nicknameWithTag) {

        if (nicknameWithTag == null || nicknameWithTag.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "A valid session nickname is required to fetch dashboard analytics."
            ));
        }

        try {
            // Delegate to the service to calculate the weak modules
            List<DomainMasteryDTO> domainMetrics = aggregationService.aggregateStudentMastery(nicknameWithTag);

            if (domainMetrics.isEmpty()) {
                // Returns standard HTTP 200 OK but with the blank slate trigger active
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "isBlankSlate", true,
                        "metrics", domainMetrics,
                        "message", "No data available yet. Complete a domain to generate your scatter plot!"
                ));
            }

            // Returns the fully aggregated DTO array for the PerformanceScatterPlot to render
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isBlankSlate", false,
                    "metrics", domainMetrics
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to aggregate mastery dashboard data."
            ));
        }
    }
}