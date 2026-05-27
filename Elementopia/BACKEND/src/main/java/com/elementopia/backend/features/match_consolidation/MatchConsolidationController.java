package com.elementopia.backend.features.match_consolidation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/match-consolidation")
@CrossOrigin(origins = "*")
public class MatchConsolidationController {

    private final ProficiencyRecalculationService recalculationService;

    public MatchConsolidationController(ProficiencyRecalculationService recalculationService) {
        this.recalculationService = recalculationService;
    }

    @PostMapping("/record-result")
    public ResponseEntity<?> processMatchCompletion(@RequestBody Map<String, Object> matchEventPayload) {

        String nicknameWithTag = (String) matchEventPayload.get("sessionNickname");
        String matchResult = (String) matchEventPayload.get("matchResult"); // Expected: "WIN", "LOSS", or "DRAW"
        Number efficiencyRaw = (Number) matchEventPayload.get("reactionPathEfficiency");

        if (nicknameWithTag == null || matchResult == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Malformed match event payload. Missing core routing identifiers."
            ));
        }

        double pathEfficiency = (efficiencyRaw != null) ? efficiencyRaw.doubleValue() : 100.0;

        try {
            // Push the variables into the recalculation block
            recalculationService.recalculateAndSaveProficiency(nicknameWithTag, matchResult, pathEfficiency);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Match results consolidated and proficiency ranks updated."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Critical failure during match consolidation transaction."
            ));
        }
    }
}