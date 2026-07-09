package com.assessmentportal.repository;

import com.assessmentportal.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BatchRepository extends MongoRepository<Batch, String> {
    Optional<Batch> findByBatchName(String batchName);
}
