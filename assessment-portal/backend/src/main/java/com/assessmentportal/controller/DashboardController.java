package com.assessmentportal.controller;

import com.assessmentportal.dto.DashboardResponse;
import com.assessmentportal.dto.DashboardResponse.ActivityData;
import com.assessmentportal.dto.DashboardResponse.CardData;
import com.assessmentportal.model.Assessment;
import com.assessmentportal.model.ClassInfo;
import com.assessmentportal.model.Material;
import com.assessmentportal.model.Submission;
import com.assessmentportal.repository.AssessmentRepository;
import com.assessmentportal.repository.ClassInfoRepository;
import com.assessmentportal.repository.MaterialRepository;
import com.assessmentportal.repository.SubmissionRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AssessmentRepository assessmentRepository;
    private final SubmissionRepository submissionRepository;
    private final ClassInfoRepository classInfoRepository;
    private final MaterialRepository materialRepository;

    public DashboardController(
            AssessmentRepository assessmentRepository,
            SubmissionRepository submissionRepository,
            ClassInfoRepository classInfoRepository,
            MaterialRepository materialRepository) {
        this.assessmentRepository = assessmentRepository;
        this.submissionRepository = submissionRepository;
        this.classInfoRepository = classInfoRepository;
        this.materialRepository = materialRepository;
    }

    @GetMapping
    public DashboardResponse getStats(
            @RequestParam String role,
            @RequestParam String userId,
            @RequestParam(defaultValue = "All") String timeFilter,
            @RequestParam(defaultValue = "") String batchFilter) {

        // Get filtered assessments
        List<Assessment> assessments;
        if (batchFilter != null && !batchFilter.isEmpty() && !batchFilter.equals("All Batches")) {
            assessments = assessmentRepository.findByBatch(batchFilter);
        } else {
            assessments = assessmentRepository.findAll();
        }

        // Apply time filter
        if (timeFilter != null && !timeFilter.equals("All")) {
            final LocalDate today = LocalDate.now();
            assessments = assessments.stream().filter(a -> {
                try {
                    String createdAt = a.getCreatedAt();
                    LocalDate createdDate;
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

        List<Submission> allSubmissions = submissionRepository.findAll();
        long totalClasses = classInfoRepository.count();

        List<Material> materials;
        if (batchFilter != null && !batchFilter.isEmpty() && !batchFilter.equals("All Batches")) {
            materials = materialRepository.findByBatch(batchFilter);
        } else {
            materials = materialRepository.findAll();
        }

        if ("teacher".equals(role)) {
            return buildTeacherDashboard(assessments, allSubmissions, totalClasses);
        } else {
            return buildLearnerDashboard(assessments, allSubmissions, totalClasses, materials, userId);
        }
    }

    private DashboardResponse buildTeacherDashboard(
            List<Assessment> assessments,
            List<Submission> submissions,
            long totalClasses) {

        long activeAssessments = assessments.stream().filter(a -> "published".equals(a.getStatus())).count();
        int totalStudents = 273;
        long gradedCount = submissions.stream().filter(s -> "marked".equals(s.getStatus())).count();
        long pendingCount = submissions.stream().filter(s -> "submitted".equals(s.getStatus())).count();

        List<CardData> cards = new ArrayList<>();
        cards.add(new CardData("Total Classes", totalClasses, "+2 This Week", "up"));
        cards.add(new CardData("Total Students", totalStudents, "+12 This Week", "up"));
        cards.add(new CardData("Active Assessments", activeAssessments, "Pending reviews", "neutral"));
        cards.add(new CardData("Submissions Graded", gradedCount + "/" + (gradedCount + pendingCount), pendingCount + " Pending", "up"));

        List<ActivityData> activity = new ArrayList<>();
        for (Submission s : submissions) {
            activity.add(new ActivityData(
                    s.getId(),
                    s.getLearnerName() + " submitted assessment",
                    s.getAssessmentTitle(),
                    "marked".equals(s.getStatus()) ? "Graded" : "Submitted",
                    formatDate(s.getSubmittedAt())
            ));
        }

        return new DashboardResponse(cards, activity);
    }

    private DashboardResponse buildLearnerDashboard(
            List<Assessment> assessments,
            List<Submission> allSubmissions,
            long totalClasses,
            List<Material> materials,
            String userId) {

        List<Submission> mySubmissions = new ArrayList<>();
        for (Submission s : allSubmissions) {
            if (userId.equals(s.getLearnerId())) {
                mySubmissions.add(s);
            }
        }

        List<String> submittedIds = new ArrayList<>();
        for (Submission s : mySubmissions) {
            submittedIds.add(s.getAssessmentId());
        }

        long pendingAssessments = 0;
        for (Assessment a : assessments) {
            if ("published".equals(a.getStatus()) && !submittedIds.contains(a.getId())) {
                pendingAssessments++;
            }
        }

        long gradedCount = 0;
        for (Submission s : mySubmissions) {
            if ("marked".equals(s.getStatus())) {
                gradedCount++;
            }
        }

        long myClasses = 0;
        for (ClassInfo c : classInfoRepository.findAll()) {
            if ("Batch A".equals(c.getBatch())) {
                myClasses++;
            }
        }

        List<CardData> cards = new ArrayList<>();
        cards.add(new CardData("My Classes", myClasses, "Current schedule", "neutral"));
        cards.add(new CardData("Pending Assessments", pendingAssessments, "Check deadlines", "down"));
        cards.add(new CardData("Submitted Assessments", mySubmissions.size(), gradedCount + " Evaluated", "up"));
        cards.add(new CardData("Course Materials", materials.size(), "New reference guides", "up"));

        List<ActivityData> activity = new ArrayList<>();
        for (Submission s : mySubmissions) {
            String status;
            if ("marked".equals(s.getStatus())) {
                status = "Score: " + s.getMarksObtained() + "/" + s.getTotalMarks();
            } else {
                status = "Evaluation Pending";
            }
            activity.add(new ActivityData(
                    s.getId(),
                    "You submitted assessment",
                    s.getAssessmentTitle(),
                    status,
                    formatDate(s.getSubmittedAt())
            ));
        }

        return new DashboardResponse(cards, activity);
    }

    private String formatDate(String isoDate) {
        try {
            if (isoDate != null && isoDate.contains("T")) {
                OffsetDateTime odt = OffsetDateTime.parse(isoDate);
                return odt.toLocalDate().format(DateTimeFormatter.ofPattern("M/d/yyyy"));
            }
        } catch (Exception ignored) {
        }
        return isoDate != null ? isoDate : "";
    }
}
