package com.elementopia.database.repository;

import com.elementopia.database.entity.LabEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabRepository extends JpaRepository<LabEntity, Long> {
    Optional<LabEntity> findByLabCode(String labCode);
}