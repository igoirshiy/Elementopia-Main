package com.elementopia.database.service;

import com.elementopia.database.entity.LessonScoreEntity;
import com.elementopia.database.repository.LessonScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LessonScoreService {

    private final LessonScoreRepository lessonScoreRepository;

    // Create or update
    public LessonScoreEntity saveLessonScore(LessonScoreEntity lessonScore) {
        LessonScoreEntity existing = lessonScoreRepository.findByLessonIdAndStudentUserId(
            lessonScore.getLessonId(), 
            lessonScore.getStudent().getUserId() // Ensure this getter path is correct
        );
        if (existing != null) {
            existing.setProgress(lessonScore.isProgress());
            existing.setScore(lessonScore.getScore());
            return lessonScoreRepository.save(existing);
        }
        return lessonScoreRepository.save(lessonScore);
    }

    // Read all
    public List<LessonScoreEntity> getAllLessonScores() {
        return lessonScoreRepository.findAll();
    }

    // Read by ID
    public Optional<LessonScoreEntity> getLessonScoreById(Long id) {
        return lessonScoreRepository.findById(id);
    }

    // Read by Lesson ID
    public LessonScoreEntity getLessonScoreByLessonId(Long lessonId) {
        return lessonScoreRepository.findByLessonId(lessonId);
    }

    // Delete
    public void deleteLessonScore(Long id) {
        lessonScoreRepository.deleteById(id);
    }
}
