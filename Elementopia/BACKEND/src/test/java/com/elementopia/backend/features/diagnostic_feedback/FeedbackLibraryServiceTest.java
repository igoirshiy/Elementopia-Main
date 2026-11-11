package com.elementopia.backend.features.diagnostic_feedback;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("FeedbackLibraryService - Meaningful Byproduct Diagnostic Unit Tests")
class FeedbackLibraryServiceTest {

    private FeedbackLibraryService feedbackService;

    @BeforeEach
    void setUp() {
        feedbackService = new FeedbackLibraryService();
    }

    @Test
    @DisplayName("TC-MOD1-009: Should provide guidance when workbench is empty")
    void testEmptyWorkbench() {
        String feedback = feedbackService.generateDiagnosticFeedback(Collections.emptyList());
        assertEquals("Your workbench is empty. Add elements to begin synthesis.", feedback);

        String nullFeedback = feedbackService.generateDiagnosticFeedback(null);
        assertEquals("Your workbench is empty. Add elements to begin synthesis.", nullFeedback);
    }

    @Test
    @DisplayName("TC-MOD1-010: Should diagnose 1:1 H and O ratio error and explain 2:1 water requirement")
    void testWaterRatioDiagnostic() {
        List<String> elements = new ArrayList<>(Arrays.asList("H", "O"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("2:1 ratio"), "Feedback should instruct the student on the 2:1 ratio for Water");
    }

    @Test
    @DisplayName("TC-MOD1-011: Should explain that O2 is diatomic gas, not a compound")
    void testDiatomicOxygenFeedback() {
        List<String> elements = new ArrayList<>(Arrays.asList("O", "O"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("two DIFFERENT elements"), "Feedback should explain the definition of a chemical compound");
    }

    @Test
    @DisplayName("TC-MOD1-012: Should diagnose incomplete Methane bonds (Carbon needs 4 bonds)")
    void testIncompleteMethaneFeedback() {
        List<String> elements = new ArrayList<>(Arrays.asList("C", "H", "H"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("Carbon needs 4 bonds"), "Feedback should guide student on Carbon's 4 valence slots");
    }

    @Test
    @DisplayName("TC-MOD1-013: Should guide chemical notation (metal before non-metal for Salt)")
    void testSaltNotationFeedback() {
        List<String> elements = new ArrayList<>(Arrays.asList("Cl", "Na"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("metal (Na) always comes before"), "Feedback should reinforce standard chemical nomenclature");
    }

    @Test
    @DisplayName("TC-MOD1-014: Should warn when single element is placed on workbench")
    void testSingleElementFeedback() {
        List<String> elements = new ArrayList<>(Collections.singletonList("H"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("at least two elements"), "Feedback should remind student that bonding requires >= 2 elements");
    }

    @Test
    @DisplayName("TC-MOD1-015: Should return default valence guidance for random unstable combinations")
    void testRandomUnstableFeedback() {
        List<String> elements = new ArrayList<>(Arrays.asList("Na", "Na", "Na", "Na"));
        String feedback = feedbackService.generateDiagnosticFeedback(elements);
        assertTrue(feedback.contains("Unstable reaction"), "Unrecognized random guess should trigger valence review guidance");
    }
}

