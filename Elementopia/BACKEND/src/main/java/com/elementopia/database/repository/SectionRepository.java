package com.elementopia.database.repository;

import com.elementopia.database.entity.SectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SectionRepository extends JpaRepository<SectionEntity, Long> {
    Optional<SectionEntity> findBySectionCode(String sectionCode);
}
