package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Batch {

    @Id
    private String id;

    private String batchName;

    private String course;

    private String subject;

    private String description;

    private String startDate;

    private String endDate;

    private String createdBy;

    private String createdAt;

    private String updatedAt;
}
