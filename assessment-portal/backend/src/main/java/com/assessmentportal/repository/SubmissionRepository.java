package com.assessmentportal.repository;

import com.assessmentportal.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByAssessmentId(String assessmentId);
    List<Submission> findByLearnerId(String learnerId);
}
