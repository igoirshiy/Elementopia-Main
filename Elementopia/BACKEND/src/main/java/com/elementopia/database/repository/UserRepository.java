package com.elementopia.database.repository;

import com.elementopia.database.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // Existing methods
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByUsernameOrEmail(String username, String email);

    // New method
    @Query("SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.score " +
            "WHERE u.role = 'STUDENT'")
    List<UserEntity> findAllStudentsWithScores();
}