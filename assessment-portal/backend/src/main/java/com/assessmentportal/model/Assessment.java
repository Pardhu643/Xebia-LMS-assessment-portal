package com.assessmentportal.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    private String id;

    private String title;

    private String subject;

    private String batch;

    private String instructions;

    private String questionType;

    private int totalMarks;

    private String deadline;

    private String status;

    private String createdAt;

    private String fileUrl;

    private String fileName;

    private String fileSize;

    private AssessmentFile file;

    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();

    public void syncQuestions() {
        if (questions != null) {
            for (Question q : questions) {
                q.setAssessment(this);
            }
        }
    }
}
