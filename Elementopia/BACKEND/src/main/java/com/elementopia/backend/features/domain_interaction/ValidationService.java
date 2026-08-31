package com.elementopia.backend.features.domain_interaction;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ValidationService {

    public boolean evaluateChemicalValidity(List<String> elements) {
        if (elements == null || elements.isEmpty()) {
            return false;
        }

        long hCount  = elements.stream().filter(e -> e.equalsIgnoreCase("H")).count();
        long oCount  = elements.stream().filter(e -> e.equalsIgnoreCase("O")).count();
        long cCount  = elements.stream().filter(e -> e.equalsIgnoreCase("C")).count();
        long nCount  = elements.stream().filter(e -> e.equalsIgnoreCase("N")).count();
        long naCount = elements.stream().filter(e -> e.equalsIgnoreCase("Na")).count();
        long clCount = elements.stream().filter(e -> e.equalsIgnoreCase("Cl")).count();
        long mgCount = elements.stream().filter(e -> e.equalsIgnoreCase("Mg")).count();
        int total = elements.size();

        // 1. Water & Peroxides
        if (total == 3 && hCount == 2 && oCount == 1) return true; // H2O
        if (total == 4 && hCount == 2 && oCount == 2) return true; // H2O2

        // 2. Carbon Oxides & Simple Hydrocarbons
        if (total == 3 && cCount == 1 && oCount == 2) return true; // CO2
        if (total == 2 && cCount == 1 && oCount == 1) return true; // CO
        if (total == 5 && cCount == 1 && hCount == 4) return true; // CH4
        if (total == 8 && cCount == 2 && hCount == 6) return true; // C2H6 Ethane
        if (total == 6 && cCount == 2 && hCount == 4) return true; // C2H4 Ethylene
        if (total == 4 && cCount == 2 && hCount == 2) return true; // C2H2 Acetylene
        if (total == 11 && cCount == 3 && hCount == 8) return true; // C3H8 Propane

        // 3. Nitrogen & Nitrogen Oxides / Acids
        if (total == 4 && nCount == 1 && hCount == 3) return true; // NH3
        if (total == 3 && nCount == 2 && oCount == 1) return true; // N2O
        if (total == 3 && nCount == 1 && oCount == 2) return true; // NO2
        if (total == 5 && hCount == 1 && nCount == 1 && oCount == 3) return true; // HNO3

        // 4. Organic Acids & Biomolecules
        if (total == 4 && cCount == 1 && hCount == 2 && oCount == 1) return true; // CH2O
        if (total == 6 && cCount == 1 && hCount == 4 && oCount == 1) return true; // CH4O
        if (total == 9 && cCount == 2 && hCount == 6 && oCount == 1) return true; // C2H6O
        if (total == 8 && cCount == 2 && hCount == 4 && oCount == 2) return true; // C2H4O2
        if (total == 5 && cCount == 1 && hCount == 2 && oCount == 2) return true; // CH2O2 Formic Acid
        if (total == 14 && cCount == 3 && hCount == 8 && oCount == 3) return true; // C3H8O3 Glycerol
        if (total == 24 && cCount == 6 && hCount == 12 && oCount == 6) return true; // C6H12O6 Glucose
        if (total == 3 && hCount == 1 && cCount == 1 && nCount == 1) return true; // HCN
        if (total == 8 && cCount == 1 && hCount == 4 && nCount == 2 && oCount == 1) return true; // CH4N2O Urea
        if (total == 10 && cCount == 2 && hCount == 5 && nCount == 1 && oCount == 2) return true; // C2H5NO2 Glycine

        // 5. Chlorides & Halides
        if (total == 2 && hCount == 1 && clCount == 1) return true; // HCl
        if (total == 2 && naCount == 1 && clCount == 1) return true; // NaCl
        if (total == 3 && mgCount == 1 && clCount == 2) return true; // MgCl2
        if (total == 6 && nCount == 1 && hCount == 4 && clCount == 1) return true; // NH4Cl

        // 6. Sodium & Magnesium Salts / Lattices
        if (total == 3 && naCount == 2 && oCount == 1) return true; // Na2O
        if (total == 2 && mgCount == 1 && oCount == 1) return true; // MgO
        if (total == 3 && naCount == 1 && oCount == 1 && hCount == 1) return true; // NaOH
        if (total == 5 && mgCount == 1 && oCount == 2 && hCount == 2) return true; // Mg(OH)2
        if (total == 6 && naCount == 1 && hCount == 1 && cCount == 1 && oCount == 3) return true; // NaHCO3 Baking Soda
        if (total == 5 && naCount == 1 && nCount == 1 && oCount == 3) return true; // NaNO3
        if (total == 5 && mgCount == 1 && cCount == 1 && oCount == 3) return true; // MgCO3
        if (total == 6 && naCount == 2 && cCount == 1 && oCount == 3) return true; // Na2CO3 Sodium Carbonate

        return false;
    }
}