package com.elementopia.backend.features.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, String> {
    Optional<UserProgress> findByNickname(String nickname);
}
