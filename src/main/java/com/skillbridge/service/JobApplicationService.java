package com.skillbridge.service;

import com.skillbridge.dto.response.JobApplicationResponse;
import com.skillbridge.entity.Graduate;
import com.skillbridge.entity.JobApplication;
import com.skillbridge.entity.JobPosting;
import com.skillbridge.exception.CustomExceptions;
import com.skillbridge.repository.JobApplicationRepository;
import com.skillbridge.repository.GraduateRepository;
import com.skillbridge.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final GraduateRepository graduateRepository;
    private final JobPostingRepository jobPostingRepository;

    @Transactional
    public JobApplicationResponse applyForJob(UUID jobPostingId, UUID graduateId) {
        // Check if job exists
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new CustomExceptions.EntityNotFoundException("Job posting not found"));

        // Check if graduate exists
        Graduate graduate = graduateRepository.findById(graduateId)
                .orElseThrow(() -> new CustomExceptions.EntityNotFoundException("Graduate not found"));

        // Check if already applied
        if (jobApplicationRepository.existsByJobPostingIdAndGraduateId(jobPostingId, graduateId)) {
            throw new CustomExceptions.BadRequestException("You have already applied for this job");
        }

        // Create application
        JobApplication application = JobApplication.builder()
                .jobPosting(jobPosting)
                .graduate(graduate)
                .status("PENDING")
                .build();

        JobApplication savedApplication = jobApplicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    public List<JobApplicationResponse> getApplicationsByJobPosting(UUID jobPostingId) {
        List<JobApplication> applications = jobApplicationRepository.findByJobPostingId(jobPostingId);
        return applications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getApplicationsByEmployer(UUID employerId) {
        List<JobApplication> applications = jobApplicationRepository.findByEmployerId(employerId);
        return applications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getApplicationsByGraduate(UUID graduateId) {
        List<JobApplication> applications = jobApplicationRepository.findByGraduateId(graduateId);
        return applications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean hasApplied(UUID jobPostingId, UUID graduateId) {
        return jobApplicationRepository.existsByJobPostingIdAndGraduateId(jobPostingId, graduateId);
    }

    @Transactional
    public void updateApplicationStatus(UUID applicationId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new CustomExceptions.EntityNotFoundException("Application not found"));

        application.setStatus(status);
        jobApplicationRepository.save(application);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobPostingId(application.getJobPosting().getId())
                .jobTitle(application.getJobPosting().getTitle())
                .companyName(application.getJobPosting().getEmployer().getCompanyName())
                .graduateId(application.getGraduate().getId())
                .graduateFullName(application.getGraduate().getFullName())
                .graduateEmail(application.getGraduate().getEmail())
                .graduateHeadline(application.getGraduate().getHeadline())
                .graduateProfilePicture(application.getGraduate().getProfilePicture())
                .graduateSkills(application.getGraduate().getSkills().stream()
                        .map(skill -> com.skillbridge.dto.response.SkillResponse.builder()
                                .id(skill.getId())
                                .skillName(skill.getSkillName())
                                .proficiencyLevel(skill.getProficiencyLevel())
                                .build())
                        .collect(Collectors.toList()))
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
