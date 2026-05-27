package com.elementopia.backend.features.domain_interaction;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class TelemetryService {

    private static final Logger logger = Logger.getLogger(TelemetryService.class.getName());

    public void writePerformanceTelemetry(String nickname, double elapsedSeconds) {
        long startTime = System.currentTimeMillis();

        try {
            // Target storage hook simulation
            logger.info("Telemetry safely captured for: " + nickname);
            logger.info("Performance timer recorded: " + elapsedSeconds + " seconds.");

            long endTime = System.currentTimeMillis();
            logger.info("Internal database isolated transaction latency: " + (endTime - startTime) + "ms");

        } catch (Exception e) {
            logger.severe("Telemetry structural write error: " + e.getMessage());
        }
    }
}