package com.elementopia.backend.features.learning_progression;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomCompletionStateRepository extends JpaRepository<RoomCompletionState, String> {

    // Custom query to sum up all correct reactions across all rooms for a specific session
    @Query("SELECT SUM(r.correctReactionCount) FROM RoomCompletionState r WHERE r.sessionNickname = :nickname")
    Integer getTotalCorrectReactions(@Param("nickname") String nickname);
}