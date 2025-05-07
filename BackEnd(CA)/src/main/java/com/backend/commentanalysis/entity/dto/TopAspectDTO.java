package com.backend.commentanalysis.entity.dto;

import lombok.Data;

@Data
public class TopAspectDTO {
    private String aspect;
    private Long kCount;
    private Long totalCount;
    private Double rate;
}
