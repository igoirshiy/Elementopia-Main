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

        return false; // No valid matching formula detected
    }
}