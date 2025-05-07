package com.backend.commentanalysis.entity.dto;

import com.backend.commentanalysis.entity.neo4j.OpinionNeo4j;
import lombok.Data;

import java.util.List;

@Data
public class AspectOpinionDTO {
    private String aspect;
    private List<String> opinions;
    private List<String> sentiments;
}
