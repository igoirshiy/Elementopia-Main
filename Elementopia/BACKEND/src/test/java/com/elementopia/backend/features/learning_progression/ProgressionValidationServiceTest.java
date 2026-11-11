package com.elementopia.backend.features.learning_progression;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ProgressionValidationService - Educational Scaffolding Unit Tests")
class ProgressionValidationServiceTest {

    private static final String TEST_NICKNAME = "Student#1234";

    private RoomCompletionStateRepository createMockRepository(Integer returnReactions, boolean shouldThrow) {
        return (RoomCompletionStateRepository) Proxy.newProxyInstance(
                RoomCompletionStateRepository.class.getClassLoader(),
                new Class<?>[]{RoomCompletionStateRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("getTotalCorrectReactions")) {
                        if (shouldThrow) {
                            throw new RuntimeException("DB Connection Timeout");
                        }
                        return returnReactions;
                    }
                    return null;
                }
        );
    }

    @Test
    @DisplayName("TC-MOD2-001: Stage 1 (Foundational Room) should always be accessible")
    void testRoomOneAlwaysAccessible() {
        RoomCompletionStateRepository repo = createMockRepository(0, false);
        ProgressionValidationService service = new ProgressionValidationService(repo);

        boolean hasAccess = service.verifyRoomAccess(TEST_NICKNAME, 1);
        assertTrue(hasAccess, "Room 1 should be accessible without prior reaction prerequisites");
    }

    @Test
    @DisplayName("TC-MOD2-002: Stage 2 should be locked if reactions are below minimum threshold (14 reactions)")
    void testRoomTwoLockedWhenInsufficient() {
        RoomCompletionStateRepository repo = createMockRepository(10, false);
        ProgressionValidationService service = new ProgressionValidationService(repo);

        boolean hasAccess = service.verifyRoomAccess(TEST_NICKNAME, 2);
        assertFalse(hasAccess, "Room 2 requires at least 14 reactions; 10 should be rejected");
    }

    @Test
    @DisplayName("TC-MOD2-003: Stage 2 should unlock when user meets required threshold (>= 14 reactions)")
    void testRoomTwoUnlockedWhenThresholdMet() {
        RoomCompletionStateRepository repo = createMockRepository(14, false);
        ProgressionValidationService service = new ProgressionValidationService(repo);

        boolean hasAccess = service.verifyRoomAccess(TEST_NICKNAME, 2);
        assertTrue(hasAccess, "Room 2 should be unlocked when 14 correct reactions are reached");
    }

    @Test
    @DisplayName("TC-MOD2-004: Should treat null reaction count as 0 reactions")
    void testNullReactionCountHandledGracefully() {
        RoomCompletionStateRepository repo = createMockRepository(null, false);
        ProgressionValidationService service = new ProgressionValidationService(repo);

        boolean hasAccess = service.verifyRoomAccess(TEST_NICKNAME, 2);
        assertFalse(hasAccess, "Null reaction count should default to 0 and remain locked");
    }

    @Test
    @DisplayName("TC-MOD2-005: Should handle repository database exceptions gracefully without crashing")
    void testDatabaseExceptionHandledSafely() {
        RoomCompletionStateRepository repo = createMockRepository(0, true);
        ProgressionValidationService service = new ProgressionValidationService(repo);

        boolean hasAccess = service.verifyRoomAccess(TEST_NICKNAME, 2);
        assertFalse(hasAccess, "Database exceptions should be caught and return false safely");
    }
}
