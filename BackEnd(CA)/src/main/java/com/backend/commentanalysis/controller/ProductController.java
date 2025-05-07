package com.backend.commentanalysis.controller;


import com.backend.commentanalysis.entity.dto.ProductInfoDTO;
import com.backend.commentanalysis.entity.dto.*;
import com.backend.commentanalysis.entity.Result;
import com.backend.commentanalysis.service.IProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@Tag(name = "产品管理接口")
@Slf4j
@Validated
public class ProductController {
    @Autowired
    private IProductService productService;

    @GetMapping("/getPidByPid")
    @Operation(summary = "获取Pid", description = "根据Pid获取Pid")
    @ResponseBody
    public Result<String> getPidByPid(String pid) {
        return Result.success(productService.getPidByPid(pid));
    }
    @GetMapping("/SearchProductByName")
    @Operation(summary ="搜索商品", description = "根据名称搜索商品，返回信息搜索项")
    @ResponseBody
    public Result<ArrayList<SearchItemDTO>> searchProductByName(String name) {
        return Result.success(productService.searchProductByName(name));
    }

    @GetMapping(value = "/getProductInfoByPid")
    @Operation(summary = "获取商品信息", description = "根据pid搜索商品，返回商品信息DTO")
    @ResponseBody
    public Result<ProductInfoDTO> getProductInfoByPid(String pid) {
        return Result.success(productService.getProductInfoByPid(pid));
    }

    @GetMapping("/getTrend")
    @Operation(summary = "获取商品评论的时间趋势", description = "返回该商品近12月每月评论数")
    @ResponseBody
    public Result<List<Map<String, Object>>> getTrend(String pid) {
        return Result.success(productService.getTrend(pid));
    }

    @GetMapping("/getReviewCount")
    @Operation(summary = "获取某商品已爬取的评论个数", description = "返回评论的数量")
    @ResponseBody
    public Result<Integer> getReviewCount(String pid) {
        return Result.success(productService.getReviewCount(pid));
    }

    @GetMapping("/compare")
    @Operation(summary = "比较商品", description = "返回对应数量的商品信息")
    @ResponseBody
    public Result<List<ProductInfoDTO>> compare(@RequestBody List<String> pidList) {
        System.out.println("pidList: " + pidList);
        if (pidList == null || pidList.isEmpty()) {
            return Result.buildFailure(201,"商品ID列表不能为空");
        }
        try {
            return Result.success(productService.compare(pidList));
        } catch (Exception e) {
            log.error("比较商品失败, pidList: {}", pidList, e);
            return Result.buildFailure(201,"比较商品失败");
        }
    }


    //List
    @GetMapping("/getProductAspectSentimentsByPid")
    @Operation(summary = "获取商品各方面词的情感极性分析", description = "返回商品所有的方面词及方面词的情感极性")
    @ResponseBody
    public Result<List<AspectSentimentDTO>> getProductSentimentsByPid(@RequestBody List<String> pidList) {
        return Result.success(productService.getProductAspectSentimentsByPid(pidList));
    }

    @GetMapping("/getProductSentimentsByPage")
    @Operation(summary = "获取商品情感极性分析(分页)", description = "返回商品及其情感极性分析")
    @ResponseBody
    public Result<List<AspectSentimentDTO>> getProductSentimentsByPage(@RequestParam Integer limit, Integer skip) {
        return Result.success(productService.getProductSentimentsByPage(limit, skip));
    }

    @GetMapping("/getProductAspectOpinionsByPid")
    @Operation(summary = "获取商品的方面及其观点，观点的情感极性", description = "返回方面及其观点，观点的情感极性")
    @ResponseBody
    public Result<List<AspectOpinionDTO>> getProductAspectOpinionByPid(@RequestBody List<String> pidList) {
        return Result.success(productService.getAspectOpinionByPid(pidList));
    }

    @GetMapping("/getTopNAspect")
    @Operation(summary = "获取商品的TopN极性的方面词,", description = "返回商品TopN极性方面词")
    @ResponseBody
    public Result<List<TopAspectDTO>> getTopNAspect(String pid, Integer limit, String kind) {
        return Result.success(productService.getTopNAspect(pid, limit, kind));
    }

    @GetMapping("/getShortcoming")
    @Operation(summary = "获取商品的缺点", description = "返回商品缺点")
    @ResponseBody
    public Result<List<ShortcomingDTO>> getShortcoming(@RequestBody List<String> pidList) {
        return Result.success(productService.getShortcoming(pidList));
    }

}

