package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "class_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassInfo {

    @Id
    private String id;

    private String name;

    private String batch;

    private String subject;

    private String time;

    private String teacherName;

    private String room;
}
