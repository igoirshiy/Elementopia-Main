package com.elementopia.database.service;

import com.elementopia.database.entity.DiscoveryEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.DiscoveryRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DiscoveryService {

    @Autowired
    private DiscoveryRepository discoveryRepo;

    @Autowired
    private UserRepository userRepo;

    public List<DiscoveryEntity> getAllDiscoveries() {
        return discoveryRepo.findAll();
    }

    public DiscoveryEntity getDiscoveryById(Long id) {
        return discoveryRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Discovery not found"));
    }

    public List<DiscoveryEntity> getDiscoveriesByUserId(Long userId) {
        return discoveryRepo.findByUser_UserId(userId);
    }

    public DiscoveryEntity createDiscovery(Long userId, DiscoveryEntity discovery) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        discovery.setUser(user);
        return discoveryRepo.save(discovery);
    }

    public DiscoveryEntity updateDiscovery(Long id, DiscoveryEntity updated) {
        DiscoveryEntity discovery = discoveryRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Discovery not found"));

        discovery.setName(updated.getName());
        discovery.setDateDiscovered(updated.getDateDiscovered());

        return discoveryRepo.save(discovery);
    }

    public String deleteDiscovery(Long id) {
        if (discoveryRepo.existsById(id)) {
            discoveryRepo.deleteById(id);
            return "Discovery with ID " + id + " deleted successfully!";
        } else {
            return "Discovery with ID " + id + " not found!";
        }
    }

}
