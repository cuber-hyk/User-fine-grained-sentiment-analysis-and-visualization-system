package com.backend.commentanalysis.entity;

import lombok.Data;

@Data
public class Product {
    private String name;
    private String stars;
    private String pid;
    private String ratings;
    private String discount_price;
    private String normal_price;
    private String about_this_item;
    private String create_time;
    private String update_time;
    private String channel;
    private String image_url;
    private String images;
    private String image_urls;
    private String classification;
}
