package com.elementopia.database.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.elementopia.database.entity.AchievementEntity;

@Repository
public interface AchievementRepository extends JpaRepository<AchievementEntity, Long> {
    List<AchievementEntity> findByUser_UserId(Long userId);
    
    Optional<AchievementEntity> findByCodeName(String codeName);
    Optional<AchievementEntity> findByTitle(String title);
    boolean existsByUser_UserIdAndCodeName(Long userId, String codeName);

}