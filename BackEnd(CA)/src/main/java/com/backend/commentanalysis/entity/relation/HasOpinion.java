package com.backend.commentanalysis.entity.relation;

import com.backend.commentanalysis.entity.neo4j.OpinionNeo4j;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
public class HasOpinion {
    @Id
    @GeneratedValue
    private Long id;
    @TargetNode
    private OpinionNeo4j opinion;

}
