package com.backend.commentanalysis.service;

import com.backend.commentanalysis.entity.dto.ProductInfoDTO;
import com.backend.commentanalysis.entity.dto.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface IProductService {


    ArrayList<SearchItemDTO> searchProductByName(String name);

    ProductInfoDTO getProductInfoByPid(String pid);
    List<Map<String, Object>> getTrend(String pid);
    int getReviewCount(String pid);

    public List<ProductInfoDTO> compare(List<String> pidList);

    String getPidByPid(String pid);

    List<AspectSentimentDTO> getProductSentimentsByPid(String pid);

    List<AspectSentimentDTO> getProductSentimentsByPage(Integer limit, Integer skip);

    List<AspectOpinionDTO> getAspectOpinionByPid(List<String> pidList);

    List<AspectSentimentDTO> getProductAspectSentimentsByPid(List<String> pidList);

    List<TopAspectDTO> getTopNAspect(String pid, Integer limit, String kind);

    List<ShortcomingDTO> getShortcoming(List<String> pidList);
}
