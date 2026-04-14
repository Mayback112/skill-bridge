package com.skillbridge.repository;

import com.skillbridge.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, UUID> {

    List<JobPosting> findByEmployerId(UUID employerId);

    List<JobPosting> findByIsActiveTrue();

    Optional<JobPosting> findByIdAndEmployerId(UUID id, UUID employerId);
}
