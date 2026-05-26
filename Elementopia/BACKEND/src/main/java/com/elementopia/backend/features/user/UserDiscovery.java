package com.elementopia.backend.features.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "user_discoveries")
@Getter
@Setter
public class UserDiscovery {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "date_discovered", length = 50, nullable = false)
    private String dateDiscovered;

    public UserDiscovery() {
        this.id = UUID.randomUUID().toString();
    }

    public UserDiscovery(String userId, String name, String dateDiscovered) {
        this();
        this.userId = userId;
        this.name = name;
        this.dateDiscovered = dateDiscovered;
    }
}
