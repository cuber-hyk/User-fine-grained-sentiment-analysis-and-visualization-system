package com.backend.commentanalysis.mapper;

import com.backend.commentanalysis.entity.dto.ProductInfoDTO;
import com.backend.commentanalysis.entity.dto.SearchItemDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.backend.commentanalysis.utils.MySqlConstants.REVIEW_TABLE;


@Mapper
public interface ProductMapper {
    String PRODUCT_TABLE = "original_data_tb_product";
    /*

     * 根据产品ID获取产品信息
     * @param pid 产品ID
     * @return ProductInfoDTO 商品信息
     */
    @Select("select * from original_data_tb_product where pid = #{pid}")
    ProductInfoDTO getProductInfoByPid(String pid);

    @Select("select pid from original_data_tb_product where pid = #{pid}")
    public String getPidByPid(String pid);


    List<ProductInfoDTO> getProductInfoByPidList(@Param("pidList") List<String> pidList);


    //TODO 搜索功能
    /*
     * 根据产品名称获取产品ID
     * @param name 产品名称
     * @return SearchItemDTO 产品ID和产品名称组成的搜索项
     */
    @Select("select name, pid, isAdded from original_data_tb_product where isAdded = 1 and name like CONCAT('%', #{name}, '%')")
    public ArrayList<SearchItemDTO> searchProductByName(String name);

    //TODO 热度趋势
    /*
     *  根据产品ID获取产品评论月趋势
     * @param pid 产品ID
     * @return trend 近12月每月评论数
     */
    @Select("select year(post_time) as year, month(post_time) as month, count(*) as count " +
            "from " + REVIEW_TABLE +
            " where pid = #{pid} " +
            "group by year(post_time), month(post_time) " +
            "order by year(post_time), month(post_time)")
    public List<Map<String, Object>> getTrend(String pid);

    /*
     * 根据产品ID获取产品评论总数
     * @param pid 产品ID
     * @return count 爬取到的评论总数（不是商品的评论总数）
     */
    @Select("select count(*) as count from " + REVIEW_TABLE +" where pid = #{pid}")
    public int getReviewCount(String pid);

}
