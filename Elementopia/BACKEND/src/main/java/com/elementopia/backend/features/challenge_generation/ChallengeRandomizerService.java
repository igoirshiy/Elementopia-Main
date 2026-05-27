package com.elementopia.backend.features.challenge_generation;

import com.elementopia.backend.features.user.User;
import com.elementopia.backend.features.user.UserRepository;
import com.elementopia.backend.features.user.UserDiscovery;
import com.elementopia.backend.features.user.UserDiscoveryRepository;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChallengeRandomizerService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final UserDiscoveryRepository discoveryRepository;

    public ChallengeRandomizerService(ChallengeRepository challengeRepository,
                                      UserRepository userRepository,
                                      UserDiscoveryRepository discoveryRepository) {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.discoveryRepository = discoveryRepository;
    }

    public List<Challenge> selectChallengesForSession(String sessionNickname, int domainId) {
        // 1. Fetch historical completed milestones directly from the student's User profile
        List<String> completedCompoundNames = Collections.emptyList();

        Optional<User> userOpt = userRepository.findByUsername(sessionNickname);
        if (userOpt.isPresent()) {
            String userId = userOpt.get().getUserId();
            // Pull all discoveries tied to this specific user UUID
            List<UserDiscovery> discoveries = discoveryRepository.findByUserId(userId);
            completedCompoundNames = discoveries.stream()
                    .map(UserDiscovery::getName)
                    .collect(Collectors.toList());
        }

        // 2. Fetch the standard pool strictly targeted to high school/Grade 8 constraints
        List<Challenge> candidatePool = challengeRepository.findByDomainAndGrade(domainId, "Grade 8");

        // 3. Filter out rows that match previously cleared milestones (Sandbox Discoveries)
        List<String> finalCompleted = completedCompoundNames; // Required for lambda scope
        List<Challenge> filteredPool = candidatePool.stream()
                .filter(c -> !finalCompleted.contains(c.getCompoundName()))
                .collect(Collectors.toList());

        // Fallback: If everything has been solved, reset the pool to avoid breaking game flow
        if (filteredPool.size() < 3) {
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