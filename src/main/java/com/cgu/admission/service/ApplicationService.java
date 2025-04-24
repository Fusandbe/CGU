package com.cgu.admission.service;

import com.cgu.admission.dto.ApplicationRequest;
import com.cgu.admission.model.Application;
import com.cgu.admission.model.ApplicationStatus;
import com.cgu.admission.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    
    @Transactional
    public Application submitApplication(ApplicationRequest request) {
        Application application = new Application();
        // Map request to application
        return applicationRepository.save(application);
    }
    
    public Application getApplicationByUserId(String userId) {
        return applicationRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    @Transactional
    public Application updateStatus(String id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}