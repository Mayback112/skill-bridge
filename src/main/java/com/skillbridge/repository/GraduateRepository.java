package com.skillbridge.repository;

import com.skillbridge.entity.Graduate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GraduateRepository extends JpaRepository<Graduate, UUID> {

    Optional<Graduate> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT g FROM Graduate g JOIN g.skills s WHERE LOWER(s.skillName) LIKE LOWER(CONCAT('%', :skill, '%')) AND g.isVerified = true")
    java.util.List<Graduate> findBySkillName(String skill);

    @Query("SELECT COUNT(g) FROM Graduate g WHERE g.isVerified = true")
    long countVerified();
}
