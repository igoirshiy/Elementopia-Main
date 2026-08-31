package com.elementopia.backend.features.learning_progression;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoomCompletionStateRepository extends JpaRepository<RoomCompletionState, Long> {

    @Query("SELECT SUM(r.correctReactionCount) FROM RoomCompletionState r WHERE r.sessionNickname = :nickname")
    Integer getTotalCorrectReactions(@Param("nickname") String nickname);

    @Transactional
    void deleteBySessionNickname(String sessionNickname);
}
