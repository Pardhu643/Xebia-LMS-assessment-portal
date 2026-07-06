package com.assessmentportal.controller;

import com.assessmentportal.dto.GradeRequest;
import com.assessmentportal.model.Submission;
import com.assessmentportal.repository.SubmissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;

    public SubmissionController(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    @GetMapping
    public List<Submission> getAll(@RequestParam(required = false) String assessmentId) {
        if (assessmentId != null && !assessmentId.isEmpty()) {
            return submissionRepository.findByAssessmentId(assessmentId);
        }
        return submissionRepository.findAll();
    }

    @PostMapping
    public Submission submit(@RequestBody Submission submission) {
        return submissionRepository.save(submission);
    }

    @PatchMapping("/{id}/grade")
    public ResponseEntity<?> grade(@PathVariable String id, @RequestBody GradeRequest request) {
        Optional<Submission> opt = submissionRepository.findById(id);

        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Submission submission = opt.get();
        submission.setMarksObtained(request.getMarks());
        submission.setFeedback(request.getFeedback());
        submission.setStatus("marked");

        submissionRepository.save(submission);
        return ResponseEntity.ok(submission);
    }
}
