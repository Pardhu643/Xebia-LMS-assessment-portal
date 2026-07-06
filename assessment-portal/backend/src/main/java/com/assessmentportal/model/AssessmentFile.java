package com.assessmentportal.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentFile {
    private String originalName;
    private String filename;
    private String fileUrl;
    private String mimeType;
    private Long size;
    private String uploadedAt;
}
