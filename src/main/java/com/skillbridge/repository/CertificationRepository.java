package com.skillbridge.repository;

import com.skillbridge.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, UUID> {

    List<Certification> findByGraduateId(UUID graduateId);
}
