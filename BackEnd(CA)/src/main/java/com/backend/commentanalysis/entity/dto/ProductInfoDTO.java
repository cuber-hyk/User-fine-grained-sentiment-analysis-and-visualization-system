package com.backend.commentanalysis.entity.dto;

import lombok.Data;


import java.io.Serializable;
import java.time.LocalDateTime;


@Data

public class ProductInfoDTO implements Serializable{

    private String name;
    private String stars;
    private String ratings;
    private String discount_price;
    private String normal_price;
    private String pid;
    private String image_url;
    private String classification;
    private String channel;
    private LocalDateTime createTime; //timestamp
    private LocalDateTime updateTime; //timestamp
}
