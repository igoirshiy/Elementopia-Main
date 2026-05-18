package com.elementopia.database.service;

import com.elementopia.database.dto.LabResponse;
import com.elementopia.database.dto.LabCreateRequest;
import com.elementopia.database.entity.LabEntity;
import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.LabRepository;
import com.elementopia.database.repository.LessonRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.List;

@Service
public class LabService {

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public LabResponse createLab(LabCreateRequest request) {
        UserEntity creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Set<UserEntity> students = new HashSet<>();
        if (request.getStudentIds() != null) {
            for (Long id : request.getStudentIds()) {
                UserEntity student = userRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
                students.add(student);
            }
        }

        Set<LessonEntity> lessons = new HashSet<>();
        if (request.getLessonIds() != null) {
            for (Long id : request.getLessonIds()) {
                LessonEntity lesson = lessonRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + id));
                lessons.add(lesson);
            }
        }

        LabEntity lab = new LabEntity();
        lab.setLaboratoryName(request.getLaboratoryName());
        lab.setLabCode(request.getLabCode());
        lab.setCreator(creator);
        lab.setStudents(students);
        lab.setLessons(lessons);

        LabEntity savedLab = labRepository.save(lab);

        return new LabResponse(
                savedLab.getLabId(),
                savedLab.getLaboratoryName(),
                savedLab.getLessons().stream().map(LessonEntity::getTitle).toList()
        );
    }

    public LabEntity addStudentToLab(String labCode, Long studentId) {
        LabEntity lab = labRepository.findByLabCode(labCode)
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        UserEntity student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!"STUDENT".equalsIgnoreCase(student.getRole())) {
            throw new RuntimeException("User is not a student");
        }

        lab.getStudents().add(student); // Set prevents duplicates
        return labRepository.save(lab);
    }

    public LabEntity addLessonToLab(String labCode, Long lessonId) {
        LabEntity lab = labRepository.findByLabCode(labCode)
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lab.getLessons().add(lesson); // Set prevents duplicates
        return labRepository.save(lab);
    }

    public List<LabEntity> getAllLabs() {
        return labRepository.findAll();
    }

    public Optional<LabEntity> getByLabCode(String labCode) {
        return labRepository.findByLabCode(labCode);
    }

    public void deleteLab(Long labId) {
        labRepository.deleteById(labId);
    }
}