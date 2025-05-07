package com.backend.commentanalysis.service.implement;

import com.backend.commentanalysis.service.ICosUploadService;
import com.backend.commentanalysis.utils.CosClientUtil;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.PutObjectResult;
import org.springframework.stereotype.Service;

import java.io.File;


@Service
public class CosUploadServiceImpl implements ICosUploadService {

    public String uploadImage(File imageFile, String key) {
        // 初始化 COS 客户端
        COSClient cosClient = CosClientUtil.initCosClient();
        try {
            // 上传文件
            PutObjectRequest putObjectRequest = new PutObjectRequest(CosClientUtil.BUCKET_NAME, key, imageFile);
            PutObjectResult putObjectResult = cosClient.putObject(putObjectRequest);
            // 返回文件访问 URL
            return "https://" + CosClientUtil.BUCKET_NAME + ".cos." + CosClientUtil.REGION + ".myqcloud.com/" + key;
        } finally {
            // 关闭客户端
            cosClient.shutdown();
        }
    }
}