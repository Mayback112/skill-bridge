package com.skillbridge.repository;

import com.skillbridge.entity.CourseResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseResourceRepository extends JpaRepository<CourseResource, UUID> {

    List<CourseResource> findBySkillTagIgnoreCase(String skillTag);
    List<CourseResource> findBySkillTagInIgnoreCase(List<String> skillTags);
}
