package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    private String id;

    private String title;

    private String subject;

    private String batch;

    private String fileName;

    private String fileSize;

    private String fileUrl;

    private String uploadedBy;

    private String uploadedAt;
}
