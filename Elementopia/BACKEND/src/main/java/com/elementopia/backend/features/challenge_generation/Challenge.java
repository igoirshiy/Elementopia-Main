package com.elementopia.backend.features.challenge_generation;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Challenge {
    private int challengeId;
    private int domainId;
    private String compoundFormula;
    private String compoundName;
    private List<String> validElements;

    public Challenge(int challengeId, int domainId, String compoundFormula, String compoundName, List<String> validElements) {
        this.challengeId = challengeId;
        this.domainId = domainId;
        this.compoundFormula = compoundFormula;
        this.compoundName = compoundName;
        this.validElements = validElements;
    }
}