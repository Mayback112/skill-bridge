package com.skillbridge.service;

import com.skillbridge.dto.request.CourseResourceRequest;
import com.skillbridge.dto.response.CourseResourceResponse;
import com.skillbridge.entity.CourseResource;
import com.skillbridge.exception.CustomExceptions.EntityNotFoundException;
import com.skillbridge.repository.CourseResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseResourceService {

    private final CourseResourceRepository courseResourceRepository;

    public List<CourseResourceResponse> getCourses(String skillTag) {
        List<CourseResource> resources = (skillTag != null && !skillTag.isBlank())
            ? courseResourceRepository.findBySkillTagIgnoreCase(skillTag)
            : courseResourceRepository.findAll();

        return resources.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CourseResourceResponse> getRecommendedCourses(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return List.of();
        }
        return courseResourceRepository.findBySkillTagInIgnoreCase(skills).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CourseResourceResponse addCourse(CourseResourceRequest request, UUID adminId) {
        CourseResource resource = CourseResource.builder()
            .title(request.getTitle())
            .url(request.getUrl())
            .platform(request.getPlatform())
            .skillTag(request.getSkillTag())
            .addedBy(adminId)
            .build();

        return toResponse(courseResourceRepository.save(resource));
    }

    @Transactional
    public void deleteCourse(UUID id) {
        CourseResource resource = courseResourceRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Course resource not found"));
        courseResourceRepository.delete(resource);
    }

    private CourseResourceResponse toResponse(CourseResource r) {
        return CourseResourceResponse.builder()
            .id(r.getId())
            .title(r.getTitle())
            .url(r.getUrl())
            .platform(r.getPlatform())
            .skillTag(r.getSkillTag())
            .build();
    }
}
