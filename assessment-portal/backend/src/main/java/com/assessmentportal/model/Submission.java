package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    private String id;

    private String assessmentId;

    private String assessmentTitle;

    private String subject;

    private String batch;

    private String learnerId;

    private String learnerName;

    private Map<String, String> answers = new HashMap<>();

    private String status;

    private Integer marksObtained;

    private int totalMarks;

    private String feedback;

    private String submittedAt;

    private Double percentage;

    private String submittedFileUrl;

    private String submittedFileName;

    private String rollNumber;

    private String deadline;
}
