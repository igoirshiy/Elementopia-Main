package com.elementopia.database.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lesson_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private UserEntity student;

    @Column(name = "progress", nullable = false)
    private boolean progress;

    @Column(name = "score", nullable = false)
    private Double score;
}