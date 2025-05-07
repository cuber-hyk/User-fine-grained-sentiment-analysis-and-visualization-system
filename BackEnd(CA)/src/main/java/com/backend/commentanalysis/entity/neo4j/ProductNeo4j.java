package com.backend.commentanalysis.entity.neo4j;
import org.springframework.data.neo4j.core.schema.*;

import java.util.List;
import java.util.Set;

@Node("Product")
public class ProductNeo4j {
    @Id
    private String pid;

    @Property("name")
    private String name;

    @Relationship(type = "HAS_ASPECT", direction = Relationship.Direction.OUTGOING)
    private List<AspectNeo4j> aspects;
}

