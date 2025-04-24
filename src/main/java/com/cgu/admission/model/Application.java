package com.cgu.admission.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "applications")
@NoArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String dateOfBirth;
    
    @Column(nullable = false)
    private String program;
    
    @ElementCollection
    private List<Education> previousEducation;
    
    @ElementCollection
    private List<Document> documentUrls;
    
    @Column(columnDefinition = "TEXT")
    private String statement;
    
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.UNDER_REVIEW;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}