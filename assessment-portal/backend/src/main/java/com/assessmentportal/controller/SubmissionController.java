package com.assessmentportal.controller;

import com.assessmentportal.dto.GradeRequest;
import com.assessmentportal.model.Assessment;
import com.assessmentportal.model.Submission;
import com.assessmentportal.model.User;
import com.assessmentportal.repository.AssessmentRepository;
import com.assessmentportal.repository.SubmissionRepository;
import com.assessmentportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import com.assessmentportal.model.Question;
import com.assessmentportal.service.CertificateService;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final CertificateService certificateService;

    public SubmissionController(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            AssessmentRepository assessmentRepository,
            CertificateService certificateService) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
        this.certificateService = certificateService;
    }

    @GetMapping
    public List<Submission> getAll(
            @RequestParam(required = false) String assessmentId,
            @RequestParam(required = false) List<String> batches,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String timeFilter,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {

        List<User> learners = userRepository.findAll();
        List<Assessment> assessments = assessmentRepository.findAll();
        List<Submission> dbSubmissions = submissionRepository.findAll();

        List<Submission> allSubmissions = new ArrayList<>();
        Map<String, Submission> subMap = new HashMap<>();

        for (Submission s : dbSubmissions) {
            subMap.put(s.getAssessmentId() + "-" + s.getLearnerId(), s);
            allSubmissions.add(s);
        }

        Instant now = Instant.now();

        for (Assessment a : assessments) {
            if (!a.getStatus().equalsIgnoreCase("published")) {
                continue;
            }
            List<String> aBatches = a.getBatches();
            for (User u : learners) {
                if (!u.getRole().equalsIgnoreCase("learner")) {
                    continue;
                }
                if (aBatches.contains(u.getBatch()) || u.getBatch().equalsIgnoreCase(a.getBatch())) {
                    String key = a.getId() + "-" + u.getId();
                    if (!subMap.containsKey(key)) {
                        Submission vs = new Submission();
                        vs.setId("v-" + key);
                        vs.setAssessmentId(a.getId());
                        vs.setAssessmentTitle(a.getTitle());
                        vs.setSubject(a.getSubject());
                        vs.setBatch(u.getBatch());
                        vs.setLearnerId(u.getId());
                        vs.setLearnerName(u.getName());
                        vs.setRollNumber(u.getRollNumber());
                        vs.setDeadline(a.getDeadline());
                        vs.setAnswers(new HashMap<>());
                        vs.setTotalMarks(a.getTotalMarks());
                        
                        try {
                            Instant deadlineInstant;
                            if (a.getDeadline().contains("T")) {
                                if (a.getDeadline().length() == 16) {
                                    deadlineInstant = Instant.parse(a.getDeadline() + ":00Z");
                                } else {
                                    deadlineInstant = Instant.parse(a.getDeadline());
                                }
                            } else {
                                deadlineInstant = Instant.parse(a.getDeadline() + "T23:59:59Z");
                            }
                            
                            if (now.isAfter(deadlineInstant)) {
                                vs.setStatus("missing");
                            } else {
                                vs.setStatus("pending");
                            }
                        } catch (Exception e) {
                            vs.setStatus("pending");
                        }
                        
                        allSubmissions.add(vs);
                    } else {
                        Submission s = subMap.get(key);
                        if (s.getRollNumber() == null || s.getRollNumber().isEmpty()) {
                            s.setRollNumber(u.getRollNumber());
                        }
                        if (s.getDeadline() == null || s.getDeadline().isEmpty()) {
                            s.setDeadline(a.getDeadline());
                        }
                        
                        if (s.getStatus().equalsIgnoreCase("submitted") && s.getSubmittedAt() != null) {
                            try {
                                Instant subInstant = Instant.parse(s.getSubmittedAt());
                                Instant deadlineInstant = Instant.parse(a.getDeadline().contains("T") ? (a.getDeadline().length() == 16 ? a.getDeadline() + ":00Z" : a.getDeadline()) : a.getDeadline() + "T23:59:59Z");
                                if (subInstant.isAfter(deadlineInstant)) {
                                    s.setStatus("late");
                                }
                            } catch (Exception e) {
                                // ignore
                            }
                        }
                    }
                }
            }
        }

        List<Submission> filtered = new ArrayList<>();
        for (Submission s : allSubmissions) {
            if (assessmentId != null && !assessmentId.isEmpty() && !s.getAssessmentId().equals(assessmentId)) {
                continue;
            }
            if (batches != null && !batches.isEmpty() && !batches.contains(s.getBatch())) {
                continue;
            }
            if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("All")) {
                String sStatus = s.getStatus();
                if (status.equalsIgnoreCase("Pending Submission") && !sStatus.equalsIgnoreCase("pending")) {
                    continue;
                } else if (status.equalsIgnoreCase("Submitted") && !sStatus.equalsIgnoreCase("submitted")) {
                    continue;
                } else if (status.equalsIgnoreCase("Reviewed") && !sStatus.equalsIgnoreCase("marked")) {
                    continue;
                } else if (status.equalsIgnoreCase("Graded") && !sStatus.equalsIgnoreCase("marked")) {
                    continue;
                } else if (status.equalsIgnoreCase("Late Submission") && !sStatus.equalsIgnoreCase("late")) {
                    continue;
                } else if (status.equalsIgnoreCase("Missing Submission") && !sStatus.equalsIgnoreCase("missing")) {
                    continue;
                }
            }
            if (search != null && !search.isEmpty()) {
                String sc = search.toLowerCase();
                boolean matches = (s.getLearnerName() != null && s.getLearnerName().toLowerCase().contains(sc)) ||
                                  (s.getRollNumber() != null && s.getRollNumber().toLowerCase().contains(sc)) ||
                                  (s.getAssessmentTitle() != null && s.getAssessmentTitle().toLowerCase().contains(sc));
                if (!matches) {
                    continue;
                }
            }
            if (timeFilter != null && !timeFilter.isEmpty() && !timeFilter.equalsIgnoreCase("All")) {
                String refTime = s.getSubmittedAt() != null ? s.getSubmittedAt() : s.getDeadline();
                if (refTime != null) {
                    try {
                        Instant refInstant = Instant.parse(refTime.contains("T") ? (refTime.length() == 16 ? refTime + ":00Z" : refTime) : refTime + "T00:00:00Z");
                        Instant start = null;
                        if (timeFilter.equalsIgnoreCase("Today")) {
                            start = now.truncatedTo(ChronoUnit.DAYS);
                        } else if (timeFilter.equalsIgnoreCase("This Week")) {
                            start = now.minus(7, ChronoUnit.DAYS);
                        } else if (timeFilter.equalsIgnoreCase("This Month")) {
                            start = now.minus(30, ChronoUnit.DAYS);
                        }
                        if (start != null && refInstant.isBefore(start)) {
                            continue;
                        }
                    } catch (Exception e) {
                        // ignore
                    }
                }
            }
            filtered.add(s);
        }

        if (sortBy != null && !sortBy.isEmpty()) {
            if (sortBy.equalsIgnoreCase("Newest First") || sortBy.equalsIgnoreCase("Submission Time")) {
                filtered.sort((a, b) -> {
                    String ta = a.getSubmittedAt() != null ? a.getSubmittedAt() : "";
                    String tb = b.getSubmittedAt() != null ? b.getSubmittedAt() : "";
                    return tb.compareTo(ta);
                });
            } else if (sortBy.equalsIgnoreCase("Oldest First")) {
                filtered.sort((a, b) -> {
                    String ta = a.getSubmittedAt() != null ? a.getSubmittedAt() : "";
                    String tb = b.getSubmittedAt() != null ? b.getSubmittedAt() : "";
                    return ta.compareTo(tb);
                });
            } else if (sortBy.equalsIgnoreCase("Highest Marks")) {
                filtered.sort((a, b) -> {
                    Integer ma = a.getMarksObtained() != null ? a.getMarksObtained() : -1;
                    Integer mb = b.getMarksObtained() != null ? b.getMarksObtained() : -1;
                    return mb.compareTo(ma);
                });
            } else if (sortBy.equalsIgnoreCase("Lowest Marks")) {
                filtered.sort((a, b) -> {
                    Integer ma = a.getMarksObtained() != null ? a.getMarksObtained() : Integer.MAX_VALUE;
                    Integer mb = b.getMarksObtained() != null ? b.getMarksObtained() : Integer.MAX_VALUE;
                    return ma.compareTo(mb);
                });
            } else if (sortBy.equalsIgnoreCase("Alphabetical")) {
                filtered.sort((a, b) -> {
                    String na = a.getLearnerName() != null ? a.getLearnerName() : "";
                    String nb = b.getLearnerName() != null ? b.getLearnerName() : "";
                    return na.compareToIgnoreCase(nb);
                });
            }
        } else {
            filtered.sort((a, b) -> {
                String ta = a.getSubmittedAt() != null ? a.getSubmittedAt() : "";
                String tb = b.getSubmittedAt() != null ? b.getSubmittedAt() : "";
                return tb.compareTo(ta);
            });
        }

        int startIdx = page * size;
        if (startIdx >= filtered.size()) {
            return new ArrayList<>();
        }
        int endIdx = Math.min(startIdx + size, filtered.size());
        return filtered.subList(startIdx, endIdx);
    }

    @PostMapping
    public Submission submit(@RequestBody Submission submission) {
        Optional<Assessment> optAssessment = assessmentRepository.findById(submission.getAssessmentId());
        if (optAssessment.isPresent()) {
            Assessment assessment = optAssessment.get();
            List<Question> questions = assessment.getQuestions();
            
            if (questions != null && !questions.isEmpty()) {
                boolean hasWritten = false;
                int mcqMarksObtained = 0;
                int totalMcqQuestions = 0;
                
                for (Question q : questions) {
                    if ("written".equalsIgnoreCase(q.getType())) {
                        hasWritten = true;
                    } else if ("mcq".equalsIgnoreCase(q.getType())) {
                        totalMcqQuestions++;
                        String studentAns = submission.getAnswers() != null ? submission.getAnswers().get(q.getId()) : null;
                        if (studentAns != null && q.getCorrectAnswer() != null) {
                            if (studentAns.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                                mcqMarksObtained += q.getMarks();
                            }
                        }
                    }
                }
                
                if (totalMcqQuestions > 0 && !hasWritten) {
                    submission.setMarksObtained(mcqMarksObtained);
                    double pct = ((double) mcqMarksObtained / assessment.getTotalMarks()) * 100.0;
                    submission.setPercentage(pct);
                    submission.setStatus("Auto Graded");
                } else if (totalMcqQuestions > 0 && hasWritten) {
                    submission.setMarksObtained(mcqMarksObtained);
                    double pct = ((double) mcqMarksObtained / assessment.getTotalMarks()) * 100.0;
                    submission.setPercentage(pct);
                    submission.setStatus("submitted");
                } else {
                    submission.setPercentage(0.0);
                }
            } else {
                submission.setPercentage(0.0);
            }
        }

        Submission saved = submissionRepository.save(submission);
        
        if ("Auto Graded".equals(saved.getStatus())) {
            certificateService.checkAndGenerate(saved.getLearnerId(), saved.getAssessmentId());
        }
        
        return saved;
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
        
        double pct = ((double) request.getMarks() / submission.getTotalMarks()) * 100.0;
        submission.setPercentage(pct);

        Submission saved = submissionRepository.save(submission);
        
        certificateService.checkAndGenerate(saved.getLearnerId(), saved.getAssessmentId());
        
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/bulk-grade")
    public ResponseEntity<?> bulkGrade(@RequestBody List<BulkGradeItem> items) {
        List<Submission> updated = new ArrayList<>();
        for (BulkGradeItem item : items) {
            Optional<Submission> opt = submissionRepository.findById(item.getId());
            if (opt.isPresent()) {
                Submission s = opt.get();
                s.setMarksObtained(item.getMarks());
                s.setFeedback(item.getFeedback());
                s.setStatus("marked");
                
                double pct = ((double) item.getMarks() / s.getTotalMarks()) * 100.0;
                s.setPercentage(pct);
                
                Submission saved = submissionRepository.save(s);
                certificateService.checkAndGenerate(saved.getLearnerId(), saved.getAssessmentId());
                updated.add(saved);
            }
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/bulk-reviewed")
    public ResponseEntity<?> bulkReviewed(@RequestBody List<String> ids) {
        List<Submission> updated = new ArrayList<>();
        for (String id : ids) {
            Optional<Submission> opt = submissionRepository.findById(id);
            if (opt.isPresent()) {
                Submission s = opt.get();
                s.setStatus("marked");
                if (s.getMarksObtained() == null) {
                    s.setMarksObtained(s.getTotalMarks());
                }
                
                double pct = ((double) s.getMarksObtained() / s.getTotalMarks()) * 100.0;
                s.setPercentage(pct);
                
                Submission saved = submissionRepository.save(s);
                certificateService.checkAndGenerate(saved.getLearnerId(), saved.getAssessmentId());
                updated.add(saved);
            }
        }
        return ResponseEntity.ok(updated);
    }

    public static class BulkGradeItem {
        private String id;
        private int marks;
        private String feedback;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public int getMarks() { return marks; }
        public void setMarks(int marks) { this.marks = marks; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }
}
