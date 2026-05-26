package com.elementopia.backend.features.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserDiscoveryRepository extends JpaRepository<UserDiscovery, String> {
    List<UserDiscovery> findByUserId(String userId);
}
