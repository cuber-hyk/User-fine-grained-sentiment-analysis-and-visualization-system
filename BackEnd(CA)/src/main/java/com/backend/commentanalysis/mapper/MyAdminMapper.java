package com.backend.commentanalysis.mapper;

import com.backend.commentanalysis.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MyAdminMapper {
    @Select("select * from tb_user where id = #{id}")
    Admin getById(Integer id);
}
