package com.elementopia.database.repository;

import com.elementopia.database.entity.DiscoveryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscoveryRepository extends JpaRepository<DiscoveryEntity, Long> {
    List<DiscoveryEntity> findByUser_UserId(Long userId);
}
