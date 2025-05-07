package com.backend.commentanalysis.entity.dto;

import lombok.Data;

import java.util.List;


@Data
public class ShortcomingDTO {
    private String pid;
    private String aspect;
    private List<String> aspectList;
    private List<Double> negRates;
}
