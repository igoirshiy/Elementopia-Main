package com.elementopia.database.repository;

import com.elementopia.database.entity.LessonScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonScoreRepository extends JpaRepository<LessonScoreEntity, Long> {
    
    LessonScoreEntity findByLessonId(Long lessonId);

    LessonScoreEntity findByLessonIdAndStudentUserId(Long lessonId, Long userId);
}