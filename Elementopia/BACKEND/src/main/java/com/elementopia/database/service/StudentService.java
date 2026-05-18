package com.elementopia.database.service;

import com.elementopia.database.entity.StudentEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.StudentRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    // Get All Students
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student By ID
    public Optional<StudentEntity> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Assign a User to Student
    public StudentEntity assignStudentRole(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not assigned as a STUDENT");
        }

        StudentEntity student = new StudentEntity();
        student.setUser(user);
        return studentRepository.save(student);
    }

    // Delete Student
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found!");
        }
        studentRepository.deleteById(id);
    }
}
