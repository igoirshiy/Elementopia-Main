package com.elementopia.backend.features.hazmat_failsafe;

import org.springframework.stereotype.Service;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class SlidingWindowEvaluationService {

    private final FailsafeTelemetryService failsafeTelemetryService;
    private final Map<String, Deque<Long>> recentFailures = new ConcurrentHashMap<>();
    private static final long SLIDING_WINDOW_MS = 15_000L;
    private static final int MAX_FAILURE_THRESHOLD = 5;

    public SlidingWindowEvaluationService(FailsafeTelemetryService failsafeTelemetryService) {
        this.failsafeTelemetryService = failsafeTelemetryService;
    }

    public boolean evaluateAttempts(String nicknameWithTag) {
        if (nicknameWithTag == null || nicknameWithTag.trim().isEmpty()) {
            return false;
        }

        long now = System.currentTimeMillis();
        long cutoff = now - SLIDING_WINDOW_MS;

        Deque<Long> queue = recentFailures.computeIfAbsent(nicknameWithTag, k -> new ConcurrentLinkedDeque<>());
        queue.addLast(now);

        // Evict expired timestamps older than 15 seconds
        while (!queue.isEmpty() && queue.peekFirst() < cutoff) {
            queue.pollFirst();
        }

        if (queue.size() >= MAX_FAILURE_THRESHOLD) {
            failsafeTelemetryService.logHazmatActivation(nicknameWithTag);
            return true;
        }

        return false;
    }

    public void clearFailedAttempts(String nicknameWithTag) {
        if (nicknameWithTag != null) {
            recentFailures.remove(nicknameWithTag);
        }
    }
}
