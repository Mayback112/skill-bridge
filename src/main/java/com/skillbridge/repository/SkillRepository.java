package com.skillbridge.repository;

import com.skillbridge.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findByGraduateId(UUID graduateId);

    @Query("SELECT s.skillName, COUNT(s) AS cnt FROM Skill s GROUP BY s.skillName ORDER BY cnt DESC")
    List<Object[]> findTopSkills();
}
