package com.elementopia.backend.features.match_consolidation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProficiencyRepository extends JpaRepository<StudentProficiencyEntity, String> {
    // Spring Data JPA provides the built-in .findById() and .save() methods to handle the overwrite logic
}