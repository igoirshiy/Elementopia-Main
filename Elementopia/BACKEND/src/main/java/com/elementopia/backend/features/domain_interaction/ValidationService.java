package com.elementopia.backend.features.domain_interaction;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class ValidationService {

    public boolean evaluateChemicalValidity(List<String> elements) {
        if (elements == null || elements.size() != 3) {
            return false;
        }

        // Sort inputs to ensure order-agnostic matching on the drop zone
        Collections.sort(elements);

        // Verbatim rule match validation example: Hydrogen + Hydrogen + Oxygen = H2O (Water)
        // Expected sorted payload inputs array: ["H", "H", "O"]
        long hydrogenCount = elements.stream().filter(e -> e.equalsIgnoreCase("H")).count();
        long oxygenCount = elements.stream().filter(e -> e.equalsIgnoreCase("O")).count();

        if (hydrogenCount == 2 && oxygenCount == 1) {
            return true; // Match found and validated successfully
        }

        // Future compound validation mappings from your predefined database pool go here
        return false;
    }
}