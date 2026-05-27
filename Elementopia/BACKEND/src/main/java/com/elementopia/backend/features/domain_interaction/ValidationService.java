package com.elementopia.backend.features.domain_interaction;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class ValidationService {

    public boolean evaluateChemicalValidity(List<String> elements) {
        if (elements == null || elements.isEmpty()) {
            return false;
        }

        // Sort choices to ensure order-agnostic matching regardless of click sequences
        Collections.sort(elements);

        // Rule Matrix Definition matching your React mock database
        // Case 1: H + H + O = H2O (Water)
        long hCount = elements.stream().filter(e -> e.equalsIgnoreCase("H")).count();
        long oCount = elements.stream().filter(e -> e.equalsIgnoreCase("O")).count();
        if (elements.size() == 3 && hCount == 2 && oCount == 1) {
            return true;
        }

        // Case 2: C + O + O = CO2 (Carbon Dioxide)
        long cCount = elements.stream().filter(e -> e.equalsIgnoreCase("C")).count();
        if (elements.size() == 3 && cCount == 1 && oCount == 2) {
            return true;
        }

        // Case 3: Na + Cl = NaCl (Salt)
        long naCount = elements.stream().filter(e -> e.equalsIgnoreCase("Na")).count();
        long clCount = elements.stream().filter(e -> e.equalsIgnoreCase("Cl")).count();
        if (elements.size() == 2 && naCount == 1 && clCount == 1) {
            return true;
        }

        // Case 4: H + H + O + O = H2O2 (Hydrogen Peroxide)
        if (elements.size() == 4 && hCount == 2 && oCount == 2) {
            return true;
        }

        // Case 5: N + H + H + H = NH3 (Ammonia)
        long nCount = elements.stream().filter(e -> e.equalsIgnoreCase("N")).count();
        if (elements.size() == 4 && nCount == 1 && hCount == 3) {
            return true;
        }

        // Case 6: Na + O + H = NaOH (Sodium Hydroxide)
        if (elements.size() == 3 && naCount == 1 && oCount == 1 && hCount == 1) {
            return true;
        }

        // Case 7: Mg + Cl + Cl = MgCl2 (Magnesium Chloride)
        long mgCount = elements.stream().filter(e -> e.equalsIgnoreCase("Mg")).count();
        if (elements.size() == 3 && mgCount == 1 && clCount == 2) {
            return true;
        }

        // Case 8: C + H + H + H + H = CH4 (Methane)
        if (elements.size() == 5 && cCount == 1 && hCount == 4) {
            return true;
        }

        // Case 9: C(6) + H(12) + O(6) = C6H12O6 (Glucose)
        if (elements.size() == 24 && cCount == 6 && hCount == 12 && oCount == 6) {
            return true;
        }

        return false; // No valid matching formula detected
    }
}