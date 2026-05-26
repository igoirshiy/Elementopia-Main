package com.elementopia.backend.features.diagnostic_feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FailedAttemptLogRepository extends JpaRepository<FailedAttemptLog, String> {
    // Spring Data JPA handles the INSERTs automatically.
    // We can add custom queries here later if Module 1.3 needs to count recent fails.
}