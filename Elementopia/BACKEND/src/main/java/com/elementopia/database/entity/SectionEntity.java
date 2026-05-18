package com.elementopia.database.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "section")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "section_code", unique = true, nullable = false)
    private String sectionCode; // frontend-generated code

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonBackReference
    private TeacherEntity teacher;


    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonManagedReference
    private List<StudentEntity> students = new ArrayList<>();
}
