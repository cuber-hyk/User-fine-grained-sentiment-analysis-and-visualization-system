package com.backend.commentanalysis.service;

import com.backend.commentanalysis.utils.CosClientUtil;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.PutObjectResult;
import java.io.File;


public interface ICosUploadService {

    public String uploadImage(File imageFile, String key);
        // 初始化 COS 客户端


}
