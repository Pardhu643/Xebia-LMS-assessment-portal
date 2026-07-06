package com.assessmentportal.repository;

import com.assessmentportal.model.ClassInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassInfoRepository extends MongoRepository<ClassInfo, String> {
}
