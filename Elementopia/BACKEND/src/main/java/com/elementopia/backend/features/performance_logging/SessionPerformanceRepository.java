package com.elementopia.backend.features.performance_logging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SessionPerformanceRepository extends JpaRepository<SessionPerformance, UUID> {
    // Basic database interaction loops are handled natively by JpaRepository
}