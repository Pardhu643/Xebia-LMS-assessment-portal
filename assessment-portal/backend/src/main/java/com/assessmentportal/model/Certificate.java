package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    private String id; // Represents certificateId

    private String studentId;
    private String studentName;
    private String assessmentId;
    private String assessmentTitle;
    private String subject;
    private double percentage;
    private int marksObtained;
    private int totalMarks;
    private String issueDate;
    private int downloadCount;
    private String certificateUrl;
    private String status;
}
