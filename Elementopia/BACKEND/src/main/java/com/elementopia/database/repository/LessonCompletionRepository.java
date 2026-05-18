package com.elementopia.database.repository;

import com.elementopia.database.entity.LessonCompletionEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.entity.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletionEntity, Long> {

    List<LessonCompletionEntity> findByUser(UserEntity user);

    List<LessonCompletionEntity> findByLesson(LessonEntity lesson);

    boolean existsByUserAndLesson(UserEntity user, LessonEntity lesson);
}
