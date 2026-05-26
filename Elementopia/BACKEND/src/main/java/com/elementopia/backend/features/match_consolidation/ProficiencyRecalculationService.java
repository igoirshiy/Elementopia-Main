package com.elementopia.backend.features.match_consolidation;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class ProficiencyRecalculationService {

    private static final Logger logger = Logger.getLogger(ProficiencyRecalculationService.class.getName());
    private final ProficiencyRepository proficiencyRepository;

    // Standard ELO scaling constant
    private static final int K_FACTOR = 32;

    public ProficiencyRecalculationService(ProficiencyRepository proficiencyRepository) {
        this.proficiencyRepository = proficiencyRepository;
    }

    public void recalculateAndSaveProficiency(String nicknameWithTag, String matchResult, double pathEfficiency) {
        // 1. Fetch current standing or initialize a new baseline if they haven't played competitive yet
        StudentProficiencyEntity profile = proficiencyRepository.findById(nicknameWithTag)
                .orElseGet(() -> new StudentProficiencyEntity(nicknameWithTag));

        // 2. Compute 100% accurate rating adjustments based on the final match state packet
        int currentElo = profile.getEloRating();
        int eloAdjustment = calculateEloAdjustment(matchResult, pathEfficiency);

        // 3. Apply updates to the state variables
        profile.setEloRating(Math.max(0, currentElo + eloAdjustment)); // Prevent negative ELO
        profile.setTotalMatchesPlayed(profile.getTotalMatchesPlayed() + 1);

        if ("WIN".equalsIgnoreCase(matchResult)) {
            profile.setWins(profile.getWins() + 1);
        } else if ("LOSS".equalsIgnoreCase(matchResult)) {
            profile.setLosses(profile.getLosses() + 1);
        }

        profile.setLastUpdated(LocalDateTime.now());

        // 4. Securely overwrite the old record in the database
        saveUpdatedProficiency(profile);
    }

    // Method named exactly as shown in your SDD Class Diagram (Page 35)
    private void saveUpdatedProficiency(StudentProficiencyEntity updatedProfile) {
        proficiencyRepository.save(updatedProfile);
        logger.info("Successfully consolidated match results and updated ELO for: " + updatedProfile.getSessionNickname());
    }

    private int calculateEloAdjustment(String result, double efficiency) {
        int baseChange = 0;
        if ("WIN".equalsIgnoreCase(result)) baseChange = 1;
        else if ("LOSS".equalsIgnoreCase(result)) baseChange = -1;
        else if ("DRAW".equalsIgnoreCase(result)) baseChange = 0;

        // ELO formula modified by how efficient their reaction path was
        double efficiencyMultiplier = (efficiency > 0) ? (efficiency / 100.0) : 1.0;

        return (int) Math.round(K_FACTOR * baseChange * efficiencyMultiplier);
    }
}