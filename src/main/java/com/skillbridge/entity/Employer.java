package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "employers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "google_id", nullable = false, unique = true)
    private String googleId;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Builder.Default
    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = true;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JobPosting> jobPostings = new ArrayList<>();

    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
