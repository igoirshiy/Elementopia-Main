package com.elementopia.database.service;

import com.elementopia.database.entity.AchievementEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.AchievementRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepo;

    @Autowired
    private UserRepository userRepo;

    public List<AchievementEntity> getAllAchievements() {
        return achievementRepo.findAll();
    }

    public AchievementEntity getAchievementById(Long id) {
        return achievementRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Achievement not found with id: " + id));
    }

    public List<AchievementEntity> getAchievementsByUserId(Long userId) {
        return achievementRepo.findByUser_UserId(userId);
    }

    @Transactional
    public AchievementEntity createAchievement(Long userId, AchievementEntity achievement) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        achievement.setUser(user);
        return achievementRepo.save(achievement);
    }

    public AchievementEntity updateAchievement(Long id, AchievementEntity updated) {
        AchievementEntity achievement = achievementRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Achievement not found with id: " + id));

        achievement.setTitle(updated.getTitle());
        achievement.setDescription(updated.getDescription());
        achievement.setDateAchieved(updated.getDateAchieved());

        return achievementRepo.save(achievement);
    }

    public boolean deleteAchievement(Long id) {
        if (achievementRepo.existsById(id)) {
            achievementRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public AchievementEntity unlockAchievementByCode(Long userId, String codeName) {
        if (achievementRepo.existsByUser_UserIdAndCodeName(userId, codeName)) {
            return null; // Already unlocked
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        AchievementEntity template = achievementRepo.findByCodeName(codeName)
                .orElseThrow(() -> new NoSuchElementException("Achievement not found with code name: " + codeName));

        AchievementEntity newAchievement = new AchievementEntity();
        newAchievement.setTitle(template.getTitle());
        newAchievement.setDescription(template.getDescription());
        newAchievement.setCodeName(template.getCodeName());
        newAchievement.setDateAchieved(LocalDate.now());
        newAchievement.setUser(user);

        return achievementRepo.save(newAchievement);
    }

    /**
     * Find an achievement by its title (used by unlockByCode if you pass a title instead of code name)
     */
    public AchievementEntity findAchievementByTitle(String title) {
        return achievementRepo.findByTitle(title)
                .orElseThrow(() -> new NoSuchElementException("Achievement not found with title: " + title));
    }

    /**
     * Check if a user has already unlocked an achievement with the given code name
     * @param userId The user ID
     * @param codeName The achievement's code name
     * @return true if already unlocked, false otherwise
     */
    public boolean hasUserUnlockedAchievement(Long userId, String codeName) {
        return achievementRepo.existsByUser_UserIdAndCodeName(userId, codeName);
    }
}
