package com.elementopia.database.service;

import com.elementopia.database.dto.CreateSectionRequest;
import com.elementopia.database.dto.JoinSectionRequest;
import com.elementopia.database.dto.SectionDTO;
import com.elementopia.database.entity.SectionEntity;
import com.elementopia.database.entity.StudentEntity;
import com.elementopia.database.entity.TeacherEntity;
import com.elementopia.database.repository.SectionRepository;
import com.elementopia.database.repository.StudentRepository;
import com.elementopia.database.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SectionService {

    private final SectionRepository sectionRepo;
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;

    public SectionService(SectionRepository sectionRepo, TeacherRepository teacherRepo, StudentRepository studentRepo) {
        this.sectionRepo = sectionRepo;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
    }

    // Create a new section
    public SectionEntity createSection(CreateSectionRequest req) {
        if (sectionRepo.findBySectionCode(req.getSectionCode()).isPresent()) {
            throw new IllegalStateException("Section code already exists!");
        }

        TeacherEntity teacher = teacherRepo.findById(req.getTeacherId())
                .orElseThrow(() -> new NoSuchElementException("Teacher not found"));

        SectionEntity section = new SectionEntity();
        section.setSectionName(req.getSectionName());
        section.setSectionCode(req.getSectionCode());
        section.setTeacher(teacher);

        return sectionRepo.save(section);
    }

    // Student joins a section
    public SectionEntity joinSection(JoinSectionRequest req) {
        StudentEntity student = studentRepo.findById(req.getStudentId())
                .orElseThrow(() -> new NoSuchElementException("Student not found"));

        if (student.getSection() != null) {
            throw new IllegalStateException("Student already joined a section!");
        }

        SectionEntity section = sectionRepo.findBySectionCode(req.getSectionCode())
                .orElseThrow(() -> new NoSuchElementException("Invalid section code"));

        student.setSection(section);
        studentRepo.save(student);

        return section;
    }

    public SectionEntity getBySectionCode(String sectionCode) {
        return sectionRepo.findBySectionCode(sectionCode)
                .orElseThrow(() -> new IllegalStateException("Class Doesn't Exist"));
    }

    public List<SectionDTO> getSectionsByTeacher(Long teacherId) {
        TeacherEntity teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new IllegalStateException("Teacher not found"));

        // Map SectionEntity -> SectionDTO
        return teacher.getSections().stream().map(section ->
                new SectionDTO(
                        section.getId(),
                        section.getSectionName(),
                        section.getSectionCode()
                )
        ).toList();
    }

    // Delete a section
    public void deleteSection(Long sectionId) {
        SectionEntity section = sectionRepo.findById(sectionId)
                .orElseThrow(() -> new NoSuchElementException("Section not found"));

        //  Detach students first (VERY important)
        List<StudentEntity> students = section.getStudents();
        if (students != null) {
            for (StudentEntity student : students) {
                student.setSection(null);
            }
            studentRepo.saveAll(students);
        }

        //  Now safe to delete section
        sectionRepo.delete(section);
    }

}
