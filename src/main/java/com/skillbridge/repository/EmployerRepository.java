package com.skillbridge.repository;

import com.skillbridge.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, UUID> {

    Optional<Employer> findByGoogleId(String googleId);

    Optional<Employer> findByEmail(String email);

    boolean existsByEmail(String email);
}
