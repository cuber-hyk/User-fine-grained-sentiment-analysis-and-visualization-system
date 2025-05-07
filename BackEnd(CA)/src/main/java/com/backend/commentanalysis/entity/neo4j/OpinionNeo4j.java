package com.backend.commentanalysis.entity.neo4j;
import org.springframework.data.neo4j.core.schema.*;

@Node("Opinion")
public class OpinionNeo4j {
    @Id
    @GeneratedValue
    private Long id;

    @Property("text")
    private String opinionText;

    @Property("sentiment")
    private String sentiment; // 情感极性：POS/NEG/NEU


}