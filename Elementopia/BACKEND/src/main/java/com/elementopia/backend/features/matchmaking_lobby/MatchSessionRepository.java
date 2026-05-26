package com.elementopia.backend.features.matchmaking_lobby;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchSessionRepository extends JpaRepository<MatchSession, String> {
    // Allows us to quickly verify if a typed room code actually exists and is waiting
}