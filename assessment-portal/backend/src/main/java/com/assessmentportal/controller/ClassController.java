package com.assessmentportal.controller;

import com.assessmentportal.model.ClassInfo;
import com.assessmentportal.repository.ClassInfoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassInfoRepository classInfoRepository;

    public ClassController(ClassInfoRepository classInfoRepository) {
        this.classInfoRepository = classInfoRepository;
    }

    @GetMapping
    public List<ClassInfo> getAll() {
        return classInfoRepository.findAll();
    }
}
