package com.elementopia.database.service;

import com.elementopia.database.entity.LessonCompletionEntity;
import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.LessonCompletionRepository;
import com.elementopia.database.repository.LessonRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class LessonCompletionService {

    @Autowired
    private LessonCompletionRepository lcRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LessonRepository lessonRepo;

    // Add completion record
    public LessonCompletionEntity completeLesson(Long userId, Long lessonId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new NoSuchElementException("Lesson not found"));

        // Prevent duplicate completion
        if (lcRepo.existsByUserAndLesson(user, lesson)) {
            throw new RuntimeException("Lesson already completed by this student.");
        }

        LessonCompletionEntity completion = new LessonCompletionEntity();
        completion.setUser(user);
        completion.setLesson(lesson);
        completion.setDateCompleted(LocalDateTime.now());

        return lcRepo.save(completion);
    }

    // All lessons completed by a student
    public List<LessonCompletionEntity> getCompletionsByUser(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return lcRepo.findByUser(user);
    }

    // All students who completed a lesson
    public List<LessonCompletionEntity> getCompletionsByLesson(Long lessonId) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new NoSuchElementException("Lesson not found"));
        return lcRepo.findByLesson(lesson);
    }

    // Delete completion
    public String deleteCompletion(Long completionId) {
        if (lcRepo.existsById(completionId)) {
            lcRepo.deleteById(completionId);
            return "Completion record deleted.";
        }
        return "Completion record not found.";
    }
}
