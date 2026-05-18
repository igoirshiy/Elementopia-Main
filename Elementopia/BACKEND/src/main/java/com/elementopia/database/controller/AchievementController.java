package com.elementopia.database.controller;

import com.elementopia.database.entity.AchievementEntity;
import com.elementopia.database.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/achievement")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping("/getAll")
    public List<AchievementEntity> getAllAchievements() {
        return achievementService.getAllAchievements();
    }

    @GetMapping("/get/{id}")
    public AchievementEntity getAchievementById(@PathVariable Long id) {
        return achievementService.getAchievementById(id);
    }

    @GetMapping("/user/{userId}")
    public List<AchievementEntity> getAchievementsByUser(@PathVariable Long userId) {
        return achievementService.getAchievementsByUserId(userId);
    }

    @PostMapping("/create/{userId}")
    public AchievementEntity createAchievement(@PathVariable Long userId, @RequestBody AchievementEntity achievement) {
        return achievementService.createAchievement(userId, achievement);
    }

    @PutMapping("/update/{id}")
    public AchievementEntity updateAchievement(@PathVariable Long id, @RequestBody AchievementEntity achievement) {
        return achievementService.updateAchievement(id, achievement);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAchievement(@PathVariable Long id) {
        boolean deleted = achievementService.deleteAchievement(id);
        if (deleted) {
            return ResponseEntity.ok("Achievement Deleted Successfully");
        } else {
            return ResponseEntity.status(404).body("Achievement not found");
        }
    }

    @PostMapping("/unlock")
    public ResponseEntity<?> unlockAchievement(@RequestParam Long userId, @RequestParam Long achievementId) {
        try {
            // Get template achievement by ID
            AchievementEntity templateAchievement = achievementService.getAchievementById(achievementId);
            
            // Check if user already has this achievement
            if (achievementService.hasUserUnlockedAchievement(userId, templateAchievement.getTitle())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User has already unlocked this achievement: " + templateAchievement.getTitle());
            }
            
            // Create new achievement for user
            AchievementEntity newAchievement = new AchievementEntity();
            newAchievement.setTitle(templateAchievement.getTitle());
            newAchievement.setDescription(templateAchievement.getDescription());
            newAchievement.setDateAchieved(LocalDate.now());
            
            // Save achievement for the user
            AchievementEntity unlockedAchievement = achievementService.createAchievement(userId, newAchievement);
            return ResponseEntity.ok(unlockedAchievement);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to unlock achievement: " + e.getMessage());
        }
    }

    @PostMapping("/unlockByCode")
    public ResponseEntity<?> unlockAchievementByCode(@RequestParam Long userId, @RequestParam String codeName) {
        try {
            // Find achievement template by title (or name) instead of code name
            AchievementEntity templateAchievement = achievementService.findAchievementByTitle(codeName);
            
            // Check if user already has this achievement
            if (achievementService.hasUserUnlockedAchievement(userId, templateAchievement.getTitle())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User has already unlocked this achievement: " + templateAchievement.getTitle());
            }
            
            // Create new achievement for the user
            AchievementEntity newAchievement = new AchievementEntity();
            newAchievement.setTitle(templateAchievement.getTitle());
            newAchievement.setDescription(templateAchievement.getDescription());
            newAchievement.setDateAchieved(LocalDate.now());
            
            // Save achievement for the user
            AchievementEntity unlockedAchievement = achievementService.createAchievement(userId, newAchievement);
            return ResponseEntity.ok(unlockedAchievement);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to unlock achievement by code: " + e.getMessage());
        }
    }
}