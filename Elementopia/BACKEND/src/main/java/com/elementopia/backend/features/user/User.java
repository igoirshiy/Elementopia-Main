package com.elementopia.backend.features.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "username", length = 50, nullable = false, unique = true)
    private String username;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "role", length = 20)
    private String role;

    @Column(name = "password", length = 100)
    private String password;

    public User() {
        this.userId = UUID.randomUUID().toString();
        this.role = "STUDENT";
    }

    public User(String username, String password) {
        this();
        this.username = username;
        this.password = password;
        this.firstName = username;
        this.lastName = "User";
    }
}
