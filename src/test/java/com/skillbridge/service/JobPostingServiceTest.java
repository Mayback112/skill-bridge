package com.skillbridge.service;

import com.skillbridge.dto.request.JobPostingRequest;
import com.skillbridge.dto.response.JobPostingResponse;
import com.skillbridge.entity.Employer;
import com.skillbridge.entity.JobPosting;
import com.skillbridge.exception.CustomExceptions.UnauthorizedException;
import com.skillbridge.repository.EmployerRepository;
import com.skillbridge.repository.JobPostingRepository;
import com.skillbridge.repository.GraduateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobPostingServiceTest {

    @Mock private JobPostingRepository jobPostingRepository;
    @Mock private EmployerRepository employerRepository;
    @Mock private GraduateRepository graduateRepository;

    @InjectMocks
    private JobPostingService jobPostingService;

    private Employer employer;
    private JobPosting job;

    @BeforeEach
    void setUp() {
        employer = Employer.builder().id(UUID.randomUUID()).companyName("Test Corp").build();
        job = JobPosting.builder().id(UUID.randomUUID()).employer(employer).title("Engineer").build();
    }

    @Test void test1_CreateJobSuccess() {
        JobPostingRequest req = new JobPostingRequest();
        req.setTitle("Dev");
        when(employerRepository.findById(any())).thenReturn(Optional.of(employer));
        when(jobPostingRepository.save(any())).thenReturn(job);
        assertNotNull(jobPostingService.createJob(req, employer.getId()));
    }

    @Test void test2_UpdateJobSuccess() {
        JobPostingRequest req = new JobPostingRequest();
        req.setTitle("Senior Dev");
        when(jobPostingRepository.findByIdAndEmployerId(any(), any())).thenReturn(Optional.of(job));
        when(jobPostingRepository.save(any())).thenReturn(job);
        assertNotNull(jobPostingService.updateJob(job.getId(), req, employer.getId()));
    }

    @Test void test3_DeleteJobSuccess() {
        when(jobPostingRepository.findByIdAndEmployerId(any(), any())).thenReturn(Optional.of(job));
        assertDoesNotThrow(() -> jobPostingService.deleteJob(job.getId(), employer.getId()));
    }

    @Test void test4_GetJobsByEmployer() {
        when(jobPostingRepository.findByEmployerId(any())).thenReturn(List.of(job));
        assertEquals(1, jobPostingService.getJobsByEmployer(employer.getId()).size());
    }

    @Test void test5_UnauthorizedUpdate() {
        when(jobPostingRepository.findByIdAndEmployerId(any(), any())).thenReturn(Optional.empty());
        assertThrows(UnauthorizedException.class, () -> 
            jobPostingService.updateJob(job.getId(), new JobPostingRequest(), UUID.randomUUID()));
    }
}
