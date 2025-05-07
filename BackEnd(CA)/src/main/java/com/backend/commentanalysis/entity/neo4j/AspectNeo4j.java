package com.backend.commentanalysis.entity.neo4j;

import org.springframework.data.neo4j.core.schema.*;

import java.util.List;
import java.util.Set;

@Node("Aspect")
public class AspectNeo4j {
    @Id
    @GeneratedValue
    private Long id;

    @Property("name")
    private String name;

    @Relationship(type = "HAS_OPINION", direction = Relationship.Direction.OUTGOING)
    private List<OpinionNeo4j> opinions;

    // 构造方法、getter/setter省略
}