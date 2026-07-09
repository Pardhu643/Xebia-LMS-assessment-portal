package com.assessmentportal.controller;

import com.assessmentportal.model.Assessment;
import com.assessmentportal.repository.AssessmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentRepository assessmentRepository;

    public AssessmentController(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    @GetMapping
    public List<Assessment> getAll(
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String timeFilter,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role) {

        List<Assessment> assessments;

        if (batch != null && !batch.isEmpty() && !batch.equals("All Batches")) {
            assessments = assessmentRepository.findByBatchOrBatchesContaining(batch);
        } else {
            assessments = assessmentRepository.findAll();
        }

        // Apply status and role filters
        if ("learner".equalsIgnoreCase(role)) {
            // Learners can ONLY see published assessments
            assessments = assessments.stream()
                    .filter(a -> "published".equalsIgnoreCase(a.getStatus()))
                    .collect(Collectors.toList());
        } else {
            // Non-learners (teachers)
            if (status != null && !status.isEmpty()) {
                assessments = assessments.stream()
                        .filter(a -> status.equalsIgnoreCase(a.getStatus()))
                        .collect(Collectors.toList());
            }
        }

        if (timeFilter != null && !timeFilter.equals("All")) {
            final LocalDate today = LocalDate.now();
            assessments = assessments.stream().filter(a -> {
                try {
                    LocalDate createdDate;
                    String createdAt = a.getCreatedAt();
                    if (createdAt.contains("T")) {
                        createdDate = OffsetDateTime.parse(createdAt).toLocalDate();
                    } else {
                        createdDate = LocalDate.parse(createdAt, DateTimeFormatter.ISO_LOCAL_DATE);
                    }

                    if ("Today".equals(timeFilter)) {
                        return createdDate.isEqual(today);
                    } else if ("This Week".equals(timeFilter)) {
                        return !createdDate.isBefore(today.minusDays(7));
                    } else if ("This Month".equals(timeFilter)) {
                        return !createdDate.isBefore(today.minusDays(30));
                    }
                    return true;
                } catch (Exception e) {
                    return true;
                }
            }).collect(Collectors.toList());
        }

        return assessments;
    }

    @PostMapping
    public Assessment save(@RequestBody Assessment assessment) {
        assessment.syncQuestions();
        if (assessment.getStatus() == null || assessment.getStatus().isEmpty()) {
            assessment.setStatus("published");
        }
        return assessmentRepository.save(assessment);
    }

    @PostMapping("/draft")
    public Assessment saveDraft(@RequestBody Assessment assessment) {
        assessment.syncQuestions();
        assessment.setStatus("draft");
        return assessmentRepository.save(assessment);
    }

    @PostMapping("/publish")
    public Assessment savePublish(@RequestBody Assessment assessment) {
        assessment.syncQuestions();
        assessment.setStatus("published");
        return assessmentRepository.save(assessment);
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> publishAssessment(@PathVariable String id) {
        return assessmentRepository.findById(id).map(a -> {
            a.setStatus("published");
            assessmentRepository.save(a);
            return ResponseEntity.ok(a);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!assessmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        assessmentRepository.deleteById(id);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(result);
    }
}
