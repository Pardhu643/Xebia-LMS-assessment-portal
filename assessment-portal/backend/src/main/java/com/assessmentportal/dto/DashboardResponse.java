package com.assessmentportal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private List<CardData> cards;
    private List<ActivityData> recentActivity;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CardData {
        private String title;
        private Object value;
        private String change;
        private String trend;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityData {
        private String id;
        private String title;
        private String detail;
        private String status;
        private String time;
    }
}
