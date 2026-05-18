package com.elementopia.database.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "lesson_completion")
@Data
public class LessonCompletionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The student who completed the lesson
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private UserEntity user;

    // The lesson that was completed
    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private LessonEntity lesson;

    // Date the student finished the lesson
    @Column(name = "date_completed", nullable = false)
    private LocalDateTime dateCompleted = LocalDateTime.now();

    // Expose lesson id and title for frontend mapping (serialized as read-only properties)
    @JsonProperty("lessonId")
    public Long getLessonId() {
        return this.lesson != null ? this.lesson.getId() : null;
    }

    @JsonProperty("lessonTitle")
    public String getLessonTitle() {
        return this.lesson != null ? this.lesson.getTitle() : null;
    }

}
