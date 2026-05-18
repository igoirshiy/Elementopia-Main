package com.elementopia.database.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "discovery")
public class DiscoveryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discoveryId;

    @Column(name = "name")
    private String name;

    @Column(name = "date_discovered")
    private LocalDate dateDiscovered;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserEntity user;
}
