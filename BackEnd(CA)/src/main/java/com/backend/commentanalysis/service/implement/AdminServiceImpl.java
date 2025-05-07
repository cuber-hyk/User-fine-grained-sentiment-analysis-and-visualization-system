package com.backend.commentanalysis.service.implement;

import com.backend.commentanalysis.entity.Admin;
import com.backend.commentanalysis.mapper.MyAdminMapper;
import com.backend.commentanalysis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl {
    @Autowired
    MyAdminMapper adminMapper;
    public Admin getById(Integer id) {
        return adminMapper.getById(id);
    }
}
