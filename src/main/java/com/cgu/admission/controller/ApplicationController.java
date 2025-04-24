package com.cgu.admission.controller;

import com.cgu.admission.dto.ApplicationRequest;
import com.cgu.admission.model.ApplicationStatus;
import com.cgu.admission.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;
    
    @PostMapping
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.submitApplication(request));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserApplication(@PathVariable String userId) {
        return ResponseEntity.ok(applicationService.getApplicationByUserId(userId));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }
}