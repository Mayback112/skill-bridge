package com.skillbridge.repository;

import com.skillbridge.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    Optional<JobApplication> findByJobPostingIdAndGraduateId(UUID jobPostingId, UUID graduateId);

    List<JobApplication> findByJobPostingId(UUID jobPostingId);

    List<JobApplication> findByGraduateId(UUID graduateId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.jobPosting.employer.id = :employerId")
    List<JobApplication> findByEmployerId(@Param("employerId") UUID employerId);

    boolean existsByJobPostingIdAndGraduateId(UUID jobPostingId, UUID graduateId);
}
