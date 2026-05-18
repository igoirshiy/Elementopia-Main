package com.elementopia.database.repository;

import com.elementopia.database.entity.TeacherEntity;
import com.elementopia.database.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    Optional<TeacherEntity> findByUser(UserEntity user);
}

