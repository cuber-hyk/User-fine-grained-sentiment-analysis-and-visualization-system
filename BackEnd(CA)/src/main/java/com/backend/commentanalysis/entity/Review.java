package com.backend.commentanalysis.entity;


import lombok.Data;

@Data
public class Review {
    private String title;
    private double rating;
    private String content;
    private String post_time;
    private String pid;
    private Integer rid;
    private String create_time;
    private String update_time;
}
