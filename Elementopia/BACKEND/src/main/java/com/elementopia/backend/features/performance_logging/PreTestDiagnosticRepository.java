package com.elementopia.backend.features.performance_logging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PreTestDiagnosticRepository extends JpaRepository<PreTestDiagnostic, UUID> {
    List<PreTestDiagnostic> findBySessionNickname(String sessionNickname);
}

