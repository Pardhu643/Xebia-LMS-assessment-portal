package com.assessmentportal.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    private String id;

    private String text;

    private String type;

    private List<String> options = new ArrayList<>();

    private String correctAnswer;

    private int marks;

    private String difficulty;

    private String explanation;

    @JsonBackReference
    @org.springframework.data.annotation.Transient
    private Assessment assessment;
}
