package com.backend.commentanalysis.controller;

import com.backend.commentanalysis.service.IUserService;
import com.backend.commentanalysis.service.implement.CosUploadServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/image")
public class ImageUploadController {

    @Autowired
    IUserService userService;

    private final CosUploadServiceImpl cosUploadServiceImpl;

    public ImageUploadController(CosUploadServiceImpl cosUploadServiceImpl) {
        this.cosUploadServiceImpl = cosUploadServiceImpl;
    }

    @PostMapping("/upload")
    @Operation(summary = "上传图片", description = "上传图片到COS")
    public String uploadImage(@RequestParam("file") MultipartFile file, Integer userId) {
        try {
            // 将 MultipartFile 转换为 File
            File tempFile = File.createTempFile("temp", null);
            file.transferTo(tempFile);
            // 生成文件路径
            String fileName = "user/resource/" + System.currentTimeMillis() + "_" + file.getOriginalFilename(); // 文件存储路径
            // 上传到 COS
            String fileUrl = cosUploadServiceImpl.uploadImage(tempFile, fileName);
            // 删除临时文件
            tempFile.delete();
            userService.updateUserIcon(fileName, userId);
            return "File uploaded successfully. URL: " + fileUrl;
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload file.";
        }
    }
}