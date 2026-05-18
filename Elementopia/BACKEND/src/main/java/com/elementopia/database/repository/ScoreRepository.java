package com.elementopia.database.repository;

import com.elementopia.database.entity.ScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScoreRepository extends JpaRepository<ScoreEntity, Long> {

    Optional<ScoreEntity> findByUser_UserId(Long userId);

    boolean existsByUser_UserId(Long userId);
}
