package com.elementopia.database.service;

import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.SubtopicEntity;
import com.elementopia.database.entity.TopicEntity;
import com.elementopia.database.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepo;

    public LessonEntity createLesson(LessonEntity lesson) {
        return lessonRepo.save(lesson);
    }

    public LessonEntity getLesson(Long id) {
        return lessonRepo.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<LessonEntity> getAllLessons() {
        return lessonRepo.findAll();
    }

    public LessonEntity addTopicToLesson(Long lessonId, TopicEntity topic) {
        LessonEntity lesson = getLesson(lessonId);
        topic.setLesson(lesson);
        lesson.getTopics().add(topic);
        return lessonRepo.save(lesson);
    }

    public LessonEntity addSubtopicToTopic(Long lessonId, Long topicId, SubtopicEntity subtopic) {
        LessonEntity lesson = getLesson(lessonId);
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        subtopic.setTopic(topic);
        topic.getSubtopics().add(subtopic);
        return lessonRepo.save(lesson);
    }

    public LessonEntity updateDescription(Long lessonId, String newDescription) {
        LessonEntity lesson = getLesson(lessonId);
        lesson.setDescription(newDescription);
        return lessonRepo.save(lesson);
    }
}
