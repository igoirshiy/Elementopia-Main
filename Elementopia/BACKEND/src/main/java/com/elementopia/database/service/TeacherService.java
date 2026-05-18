package com.elementopia.database.service;

import com.elementopia.database.entity.TeacherEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.TeacherRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    //  Get All Teachers
    public List<TeacherEntity> getAllTeachers() {
        return teacherRepository.findAll();
    }

    //  Get Teacher By ID
    public Optional<TeacherEntity> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    //  NEW: Get Teacher of Logged-in User
    public TeacherEntity getMyTeacher(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return teacherRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
    }

    //  Assign a User to Teacher
    public TeacherEntity assignTeacherRole(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"TEACHER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not assigned as a TEACHER");
        }

        TeacherEntity teacher = new TeacherEntity();
        teacher.setUser(user);
        return teacherRepository.save(teacher);
    }

    //  Delete Teacher
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found!");
        }
        teacherRepository.deleteById(id);
    }
}
