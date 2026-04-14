package com.skillbridge.repository;

import com.skillbridge.entity.JobCanDo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobCanDoRepository extends JpaRepository<JobCanDo, UUID> {

    List<JobCanDo> findByGraduateId(UUID graduateId);
}
