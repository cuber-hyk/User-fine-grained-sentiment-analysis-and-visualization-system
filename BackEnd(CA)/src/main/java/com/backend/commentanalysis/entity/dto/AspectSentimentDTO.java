package com.backend.commentanalysis.entity.dto;

import lombok.Data;

@Data
public class AspectSentimentDTO {
    private String productName;
    private String aspect;
    private Long totalOpinions;
    private Long positiveOpinions;
    private Long negativeOpinions;
    private Long neutralOpinions;

    public AspectSentimentDTO(String productName, String aspect, Long totalOpinions, Long positiveOpinions, Long negativeOpinions, Long neutralOpinions) {
        this.aspect = aspect;
        this.totalOpinions = totalOpinions;
        this.positiveOpinions = positiveOpinions;
        this.negativeOpinions = negativeOpinions;
        this.neutralOpinions = neutralOpinions;
        this.productName = productName;
    }
}
