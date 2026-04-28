package com.skillbridge.service;

import com.skillbridge.entity.CourseResource;
import com.skillbridge.repository.CourseResourceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseResourceServiceTest {

    @Mock private CourseResourceRepository courseResourceRepository;
    @InjectMocks private CourseResourceService courseResourceService;

    @Test void test1_RecommendWithSingleSkill() {
        when(courseResourceRepository.findBySkillTagInIgnoreCase(anyList()))
            .thenReturn(List.of(CourseResource.builder().title("Java 101").build()));
        assertFalse(courseResourceService.getRecommendedCourses(List.of("Java")).isEmpty());
    }

    @Test void test2_RecommendWithMultipleSkills() {
        when(courseResourceRepository.findBySkillTagInIgnoreCase(anyList()))
            .thenReturn(List.of(new CourseResource(), new CourseResource()));
        assertEquals(2, courseResourceService.getRecommendedCourses(List.of("Java", "React")).size());
    }

    @Test void test3_RecommendNoSkills() {
        assertTrue(courseResourceService.getRecommendedCourses(Collections.emptyList()).isEmpty());
    }

    @Test void test4_RecommendNoMatches() {
        when(courseResourceRepository.findBySkillTagInIgnoreCase(anyList())).thenReturn(Collections.emptyList());
        assertTrue(courseResourceService.getRecommendedCourses(List.of("Unknown")).isEmpty());
    }

    @Test void test5_RecommendCaseInsensitive() {
        when(courseResourceRepository.findBySkillTagInIgnoreCase(anyList())).thenReturn(List.of(new CourseResource()));
        assertFalse(courseResourceService.getRecommendedCourses(List.of("java")).isEmpty());
    }
}
