package com.elementopia.backend.features.domain_interaction;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ValidationService - Stoichiometric Chemical Reaction Unit Tests")
class ValidationServiceTest {

    private ValidationService validationService;

    @BeforeEach
    void setUp() {
        validationService = new ValidationService();
    }

    @Test
    @DisplayName("TC-MOD1-001: Should validate Water (H2O) formation")
    void testWaterFormation() {
        List<String> water = Arrays.asList("H", "H", "O");
        assertTrue(validationService.evaluateChemicalValidity(water), "2H + 1O should synthesize valid H2O");
    }

    @Test
    @DisplayName("TC-MOD1-002: Should validate Carbon Dioxide (CO2) formation")
    void testCarbonDioxideFormation() {
        List<String> co2 = Arrays.asList("C", "O", "O");
        assertTrue(validationService.evaluateChemicalValidity(co2), "1C + 2O should synthesize valid CO2");
    }

    @Test
    @DisplayName("TC-MOD1-003: Should validate Table Salt (NaCl) ionic bond")
    void testSaltFormation() {
        List<String> nacl = Arrays.asList("Na", "Cl");
        assertTrue(validationService.evaluateChemicalValidity(nacl), "1Na + 1Cl should synthesize valid NaCl");
    }

    @Test
    @DisplayName("TC-MOD1-004: Should validate Ammonia (NH3) covalent bond")
    void testAmmoniaFormation() {
        List<String> nh3 = Arrays.asList("N", "H", "H", "H");
        assertTrue(validationService.evaluateChemicalValidity(nh3), "1N + 3H should synthesize valid NH3");
    }

    @Test
    @DisplayName("TC-MOD1-005: Should validate Methane (CH4) covalent bond")
    void testMethaneFormation() {
        List<String> ch4 = Arrays.asList("C", "H", "H", "H", "H");
        assertTrue(validationService.evaluateChemicalValidity(ch4), "1C + 4H should synthesize valid CH4");
    }

    @Test
    @DisplayName("TC-MOD1-006: Should reject empty or null element lists")
    void testNullOrEmptyInput() {
        assertFalse(validationService.evaluateChemicalValidity(null), "Null input should be invalid");
        assertFalse(validationService.evaluateChemicalValidity(Collections.emptyList()), "Empty list should be invalid");
    }

    @Test
    @DisplayName("TC-MOD1-007: Should reject chemically invalid combinations")
    void testInvalidCombinations() {
        List<String> randomMix = Arrays.asList("Na", "Na", "Na", "C");
        assertFalse(validationService.evaluateChemicalValidity(randomMix), "Random metal/carbon mix should be invalid");

        List<String> unbalanced = Arrays.asList("H", "O");
        assertFalse(validationService.evaluateChemicalValidity(unbalanced), "1H + 1O is chemically incomplete");
    }

    @Test
    @DisplayName("TC-MOD1-008: Should handle case-insensitive chemical symbols")
    void testCaseInsensitivity() {
        List<String> lowercaseWater = Arrays.asList("h", "h", "o");
        assertTrue(validationService.evaluateChemicalValidity(lowercaseWater), "Case-insensitive symbols should still be valid");
    }
}

