package com.elementopia.backend.features.diagnostic_feedback;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class FeedbackLibraryService {

    public String generateDiagnosticFeedback(List<String> elements) {
        if (elements == null || elements.isEmpty()) {
            return "Your workbench is empty. Add elements to begin synthesis.";
        }

        // Sort to ensure predictable string matching regardless of drop order
        Collections.sort(elements);
        String formula = String.join("", elements);

        // Targeted Micro-lessons for common Grade 8 chemistry mistakes
        if (formula.equals("HO") || formula.equals("OH")) {
            return "Hydrogen and Oxygen need a 2:1 ratio to form Water. Hydrogen only has 1 valence electron to share, but Oxygen needs 2 to complete its shell!";
        }

        if (formula.equals("OO") || formula.equals("O2")) {
            return "O2 is Oxygen gas, a valid molecule! However, this domain requires compounds (molecules made of at least two DIFFERENT elements).";
        }

        if (formula.contains("C") && formula.contains("H") && elements.size() < 5) {
            return "Carbon needs 4 bonds to be stable. To make Methane, you need one Carbon to bond with four individual Hydrogens.";
        }

        if (formula.equals("ClNa")) {
            return "You have the right elements for Salt! But remember standard notation: the metal (Na) always comes before the non-metal (Cl). Try NaCl.";
        }

        if (elements.size() == 1) {
            return "A compound requires at least two elements to form a bond. You only placed one.";
        }

        // Fallback for completely random guesses
        return "Unstable reaction. Review the valence electrons of your chosen elements to find a stable bonding ratio.";
    }
}