package com.skillbridge.service;

import com.skillbridge.dto.request.JobPostingRequest;
import com.skillbridge.dto.response.JobPostingResponse;
import com.skillbridge.entity.Employer;
import com.skillbridge.entity.JobPosting;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.EmployerRepository;
import com.skillbridge.repository.JobPostingRepository;
import com.skillbridge.repository.GraduateRepository;
import com.skillbridge.entity.Graduate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final EmployerRepository employerRepository;
    private final GraduateRepository graduateRepository;

    public List<JobPostingResponse> getRecommendedJobsForGraduate(UUID graduateId) {
        Graduate graduate = graduateRepository.findById(graduateId)
                .orElseThrow(() -> new EntityNotFoundException("Graduate not found"));

        Set<String> graduateSkills = graduate.getSkills().stream()
                .map(skill -> skill.getSkillName().toLowerCase().trim())
                .collect(Collectors.toSet());

        if (graduateSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<JobPosting> allActiveJobs = jobPostingRepository.findByIsActiveTrue();

        return allActiveJobs.stream()
                .filter(job -> {
                    if (job.getRequiredSkills() == null) return false;
                    return Arrays.stream(job.getRequiredSkills())
                            .anyMatch(skill -> graduateSkills.contains(skill.toLowerCase().trim()));
                })
                .sorted((j1, j2) -> {
                    long matchCount1 = Arrays.stream(j1.getRequiredSkills())
                            .filter(skill -> graduateSkills.contains(skill.toLowerCase().trim()))
                            .count();
                    long matchCount2 = Arrays.stream(j2.getRequiredSkills())
                            .filter(skill -> graduateSkills.contains(skill.toLowerCase().trim()))
                            .count();
                    return Long.compare(matchCount2, matchCount1);
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobPostingResponse createJob(JobPostingRequest request, UUID employerId) {
        Employer employer = employerRepository.findById(employerId)
            .orElseThrow(() -> new EntityNotFoundException("Employer not found"));

        JobPosting job = JobPosting.builder()
            .employer(employer)
            .title(request.getTitle())
            .description(request.getDescription())
            .requiredSkills(request.getRequiredSkills())
            .isActive(true)
            .build();

        return toResponse(jobPostingRepository.save(job));
    }

    public List<JobPostingResponse> getAllActiveJobs() {
        return jobPostingRepository.findByIsActiveTrue().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<JobPostingResponse> getJobsByEmployer(UUID employerId) {
        return jobPostingRepository.findByEmployerId(employerId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public JobPostingResponse getJobById(UUID id) {
        JobPosting job = jobPostingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Job posting not found"));
        return toResponse(job);
    }

    @Transactional
    public JobPostingResponse updateJob(UUID id, JobPostingRequest request, UUID employerId) {
        JobPosting job = jobPostingRepository.findByIdAndEmployerId(id, employerId)
            .orElseThrow(() -> new UnauthorizedException("Job not found or you don't own this posting"));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());

        return toResponse(jobPostingRepository.save(job));
    }

    @Transactional
    public void deleteJob(UUID id, UUID employerId) {
        JobPosting job = jobPostingRepository.findByIdAndEmployerId(id, employerId)
            .orElseThrow(() -> new UnauthorizedException("Job not found or you don't own this posting"));
        jobPostingRepository.delete(job);
    }

    private JobPostingResponse toResponse(JobPosting job) {
        return JobPostingResponse.builder()
            .id(job.getId())
            .employerId(job.getEmployer().getId())
            .companyName(job.getEmployer().getCompanyName())
            .title(job.getTitle())
            .description(job.getDescription())
            .requiredSkills(job.getRequiredSkills())
            .isActive(job.isActive())
            .createdAt(job.getCreatedAt())
            .updatedAt(job.getUpdatedAt())
            .build();
    }
}
