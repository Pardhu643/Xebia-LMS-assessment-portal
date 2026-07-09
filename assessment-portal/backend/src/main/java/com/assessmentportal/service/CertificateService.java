package com.assessmentportal.service;

import com.assessmentportal.model.Certificate;
import com.assessmentportal.model.Submission;
import com.assessmentportal.model.User;
import com.assessmentportal.repository.CertificateRepository;
import com.assessmentportal.repository.SubmissionRepository;
import com.assessmentportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public CertificateService(CertificateRepository certificateRepository,
                              SubmissionRepository submissionRepository,
                              UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    public Optional<Certificate> checkAndGenerate(String studentId, String assessmentId) {
        // Prevent duplicate certificate generation
        Optional<Certificate> existing = certificateRepository.findByStudentIdAndAssessmentId(studentId, assessmentId);
        if (existing.isPresent()) {
            return existing;
        }

        // Get submission
        Optional<Submission> optSubmission = submissionRepository.findByAssessmentIdAndLearnerId(assessmentId, studentId);
        if (!optSubmission.isPresent()) {
            return Optional.empty();
        }

        Submission submission = optSubmission.get();
        
        // Calculate percentage
        double pct = 0;
        if (submission.getMarksObtained() != null) {
            pct = ((double) submission.getMarksObtained() / submission.getTotalMarks()) * 100.0;
        }

        // Score threshold (90%)
        if (pct < 90.0) {
            return Optional.empty();
        }

        // Retrieve user
        Optional<User> optUser = userRepository.findById(studentId);
        String studentName = optUser.isPresent() ? optUser.get().getName() : submission.getLearnerName();

        // Create new Certificate
        Certificate certificate = new Certificate();
        certificate.setId(UUID.randomUUID().toString());
        certificate.setStudentId(studentId);
        certificate.setStudentName(studentName);
        certificate.setAssessmentId(assessmentId);
        certificate.setAssessmentTitle(submission.getAssessmentTitle());
        certificate.setSubject(submission.getSubject());
        certificate.setPercentage(pct);
        certificate.setMarksObtained(submission.getMarksObtained() != null ? submission.getMarksObtained() : 0);
        certificate.setTotalMarks(submission.getTotalMarks());
        certificate.setIssueDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        certificate.setDownloadCount(0);
        certificate.setCertificateUrl("/api/certificates/preview/" + certificate.getId());
        certificate.setStatus("Active");

        return Optional.of(certificateRepository.save(certificate));
    }
}
