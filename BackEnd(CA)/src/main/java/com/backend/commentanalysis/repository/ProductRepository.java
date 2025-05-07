package com.backend.commentanalysis.repository;

import com.backend.commentanalysis.entity.dto.AspectOpinionDTO;
import com.backend.commentanalysis.entity.dto.AspectSentimentDTO;
import com.backend.commentanalysis.entity.dto.ShortcomingDTO;
import com.backend.commentanalysis.entity.dto.TopAspectDTO;
import com.backend.commentanalysis.entity.neo4j.ProductNeo4j;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends Neo4jRepository<ProductNeo4j, String> {

    @Operation(summary = "获取产品情感统计", description = "获取产品情感统计，所有产品的统计")
    @Query(
    """
       MATCH (p:Product)-[:HAS_ASPECT]->(a:Aspect)-[:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
       WITH
          p.pid AS productId,
          p.name AS productName,
          COUNT(o) AS totalOpinions,
          SUM(CASE WHEN toUpper(s.type) = 'POS' THEN 1 ELSE 0 END) AS positiveOpinions,
          SUM(CASE WHEN toUpper(s.type) = 'NEG' THEN 1 ELSE 0 END) AS negativeOpinions,
          SUM(CASE WHEN toUpper(s.type) = 'NEU' THEN 1 ELSE 0 END) AS neutralOpinions
      ORDER BY totalOpinions DESC
      LIMIT $limit
      SKIP $skip
      RETURN productName,totalOpinions,positiveOpinions,negativeOpinions,neutralOpinions
    """
    )
    List<AspectSentimentDTO> getProductSentimentsByPage(
        @Param("limit") Integer limit,
        @Param("skip") Integer skip
    );


    @Operation(summary = "获取产品情感统计", description = "获取产品情感统计，pid对应的产品的统计")
    @Query(
           """
           MATCH (p:Product {pid: $pid})-[:HAS_ASPECT]->(a:Aspect)-[r:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
               RETURN a.name AS aspect,
                      COUNT(r) AS totalOpinions,
                      SUM(CASE WHEN toUpper(s.type) = 'POS' THEN 1 ELSE 0 END) AS positiveOpinions,
                      SUM(CASE WHEN toUpper(s.type) = 'NEG' THEN 1 ELSE 0 END) AS negativeOpinions,
                      SUM(CASE WHEN toUpper(s.type) = 'NEU' THEN 1 ELSE 0 END) AS neutralOpinions
               ORDER BY aspect
           """
    )
    List<AspectSentimentDTO> getProductSentimentsByPid(@Param("pid")String pid);


    @Operation(summary = "获取产品的各方面的情感统计", description = "获取产品各方面的情感统计，对应的pid列表的产品的统计")   @Query(
            """
                MATCH (p:Product)-[:HAS_ASPECT]->(a:Aspect)-[r:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
                WHERE p.pid IN $pidList
                RETURN p.name AS productName,
                       a.name AS aspect,
                       COUNT(r) AS totalOpinions,
                       SUM(CASE WHEN toUpper(s.type) = 'POS' THEN 1 ELSE 0 END) AS positiveOpinions,
                       SUM(CASE WHEN toUpper(s.type) = 'NEG' THEN 1 ELSE 0 END) AS negativeOpinions,
                       SUM(CASE WHEN toUpper(s.type) = 'NEU' THEN 1 ELSE 0 END) AS neutralOpinions
                ORDER BY aspect
            """
    )
    List<AspectSentimentDTO> getProductAspectSentimentsByPid(@Param("pidList") List<String> pidList);


    @Operation(summary = "获取产品的 aspects 和 opinions以及sentiment", description = "获取产品 aspects 和 opinions以及sentiment，对应的pid列表的产品的统计")
    @Query(
            """
                MATCH (p:Product)-[:HAS_ASPECT]->(a:Aspect)-[r:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
                WHERE p.pid IN $pidList
                RETURN
                    a.name AS aspect,
                    COLLECT(o.description) as opinions,
                    COLLECT(s.type) as sentiments
           """
    )
    List<AspectOpinionDTO> getAspectOpinionByPid(@Param("pidList") List<String> pidList);


    @Operation(summary = "获取商品各方面的topN(POS/NEG/NEG)观点", description = "获取商品各方面的topN(POS/NEG/NEG)观点")
    @Query(
            """
                MATCH (p:Product)-[:HAS_ASPECT]->(a:Aspect)-[:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
                WHERE p.pid = $pid
                WITH
                    p.pid AS productId, a.name AS aspect,
                    SUM(CASE WHEN toUpper(s.type) = $kind THEN 1 ELSE 0 END) AS kCount,
                    COUNT(o) AS totalCount
                WHERE totalCount > 0
                WITH aspect, kCount, totalCount, round(toFloat(kCount) / toFloat(totalCount) * 1000) / 1000 AS rate
                ORDER BY rate DESC
                LIMIT $limit
                RETURN
                aspect,
                kCount,
                totalCount,
                rate    
            """
    )
    List<TopAspectDTO> getTopNAspect(@Param("pid") String pid, @Param("limit") Integer limit,
                                       @Param("kind") String kind);

    @Operation(summary = "获取商品缺点 aspects", description = "获取商品缺点 aspects， 根据PidList")
    @Query(
            """
                MATCH (p:Product)-[:HAS_ASPECT]->(a:Aspect)-[:HAS_OPINION]->(o:Opinion)-[:HAS_SENTIMENT]->(s:Sentiment)
                WHERE p.pid IN $pidList
                WITH
                    p.pid AS pid,
                    a.name AS aspect,
                    SUM(CASE WHEN s.type = 'NEG' THEN 1 ELSE 0 END) AS negCount,
                    SUM(CASE WHEN s.type = 'POS' THEN 1 ELSE 0 END) AS posCount,
                    COUNT(o) AS totalCount
                WHERE totalCount > 0 AND negCount >= posCount
                WITH pid, aspect, negCount, totalCount, toFloat(negCount) / toFloat(totalCount)  AS negRate
                ORDER BY negRate DESC
                RETURN pid, COLLECT(aspect) as aspectList, COLLECT(round(negRate, 3)) as negRates
            """
    )
    List<ShortcomingDTO> getShortcoming(@Param("pidList") List<String> pidList);
   }
