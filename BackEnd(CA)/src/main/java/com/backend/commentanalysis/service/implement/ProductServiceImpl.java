package com.backend.commentanalysis.service.implement;

import com.backend.commentanalysis.entity.dto.ProductInfoDTO;
import com.backend.commentanalysis.entity.dto.*;
import com.backend.commentanalysis.mapper.ProductMapper;
import com.backend.commentanalysis.repository.ProductRepository;
import com.backend.commentanalysis.service.IProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@CacheConfig(cacheNames = "product")
public class ProductServiceImpl implements IProductService {

    @Autowired private ProductMapper productMapper;
    @Autowired private ProductRepository productRepository;

    @Override
    public ArrayList<SearchItemDTO> searchProductByName(String name) {
        return productMapper.searchProductByName(name);
    }


    @Override
    @Cacheable(value = "product", key = "#pid")
    public ProductInfoDTO getProductInfoByPid(String pid) {
        return productMapper.getProductInfoByPid(pid);
    }

    @Override
    @Cacheable(value = "trend", key = "#pid")
    public List<Map<String, Object>> getTrend(String pid) {
        return productMapper.getTrend(pid);
    }

    @Override
    @Cacheable(value = "reviewCount", key = "#pid")
    public int getReviewCount(String pid) {
        return productMapper.getReviewCount(pid);
    }

    @Override
    public List<ProductInfoDTO> compare(List<String> pidList) {
        log.info("开始比较商品, pidList: {}", pidList);
        return productMapper.getProductInfoByPidList(pidList);
    }

    @Override
    public String getPidByPid(String pid){
        return productMapper.getPidByPid(pid);
    }

    @Override
    public List<AspectSentimentDTO> getProductSentimentsByPid(String pid) {
        log.info("获取商品情感分析信息, pid: {}", pid);
        return productRepository.getProductSentimentsByPid(pid);
    }

    @Override
    public List<AspectSentimentDTO> getProductSentimentsByPage(Integer limit, Integer skip) {
        return productRepository.getProductSentimentsByPage(limit, skip);
    }

    @Override
    public List<AspectOpinionDTO> getAspectOpinionByPid(List<String> pidList) {
        return productRepository.getAspectOpinionByPid(pidList);
    }

    @Override
    public List<AspectSentimentDTO> getProductAspectSentimentsByPid(List<String> pidList){
        return productRepository.getProductAspectSentimentsByPid(pidList);
    }

    @Override
    public List<TopAspectDTO> getTopNAspect(String pid, Integer limit, String kind){
        return productRepository.getTopNAspect(pid, limit, kind);
    }

    @Override
    public List<ShortcomingDTO> getShortcoming(List<String> pidList) {
        return productRepository.getShortcoming(pidList);
    }


}
