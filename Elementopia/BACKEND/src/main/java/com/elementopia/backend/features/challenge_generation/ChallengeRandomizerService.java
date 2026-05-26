package com.elementopia.backend.features.challenge_generation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChallengeRandomizerService {

    private final ChallengeRepository challengeRepository;
    private final JdbcTemplate jdbcTemplate;

    public ChallengeRandomizerService(ChallengeRepository challengeRepository, JdbcTemplate jdbcTemplate) {
        this.challengeRepository = challengeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Challenge> selectChallengesForSession(UUID sessionId, int domainId) {
        // 1. Fetch historical completed milestones from the active session logs to clear duplicate paths
        String sql = "SELECT submission_string FROM FAILED_ATTEMPT_LOG WHERE is_correct = true";
        // Note: Real deployment would filter WHERE session_id = ? based on state trackers

        List<String> completedFormulas = jdbcTemplate.queryForList(sql, String.class);

        // 2. Fetch the standard pool strictly targeted to high school/Grade 8 constraints
        List<Challenge> candidatePool = challengeRepository.findByDomainAndGrade(domainId, "Grade 8");

        // 3. Filter out rows that matches previously cleared milestones in this current session block
        List<Challenge> filteredPool = candidatePool.stream()
                .filter(c -> !completedFormulas.contains(c.getCompoundFormula()))
                .collect(Collectors.toList());

        // Fallback: If everything has been solved, reset the pool to avoid breaking game flow
        if (filteredPool.isEmpty()) {
            filteredPool = candidatePool;
        }

        // 4. Run the reshuffling algorithm to discard predictability limits
        return reshufflePool(filteredPool);
    }

    private List<Challenge> reshufflePool(List<Challenge> pool) {
        Collections.shuffle(pool);
        // Limit challenge sets to 3 active puzzles per standard single-player arena session
        return pool.stream().limit(3).collect(Collectors.toList());
    }
}