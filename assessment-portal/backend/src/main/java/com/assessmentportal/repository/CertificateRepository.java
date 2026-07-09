package com.assessmentportal.repository;

import com.assessmentportal.model.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    List<Certificate> findByStudentId(String studentId);
    Optional<Certificate> findByStudentIdAndAssessmentId(String studentId, String assessmentId);
}
