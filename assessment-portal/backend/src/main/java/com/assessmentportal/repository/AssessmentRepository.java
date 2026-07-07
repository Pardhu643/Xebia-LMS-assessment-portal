package com.assessmentportal.repository;

import com.assessmentportal.model.Assessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends MongoRepository<Assessment, String> {
    @Query("{'$or': [{'batch': ?0}, {'batches': ?0}]}")
    List<Assessment> findByBatchOrBatchesContaining(String batch);
}
