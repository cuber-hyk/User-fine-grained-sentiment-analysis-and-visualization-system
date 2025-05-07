package com.backend.commentanalysis.interceptor;
import ch.qos.logback.core.util.StringUtil;
import cn.hutool.core.bean.BeanUtil;

import com.backend.commentanalysis.entity.dto.UserUpdateInfoDTO;
import com.backend.commentanalysis.utils.UserHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;


import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.backend.commentanalysis.utils.RedisConstants.LOGIN_USER_KEY;
import static com.backend.commentanalysis.utils.RedisConstants.LOGIN_USER_TTL;


public class RefreshTokenInterceptor implements HandlerInterceptor {

    // 这里是拦截器 不在spring容器中 不能同@Autowired注入stringRedisTemplate
    // 换个方法 在配置类中注入
    // 或者加个注解：@Configuration 就可以自动注入啦
    private StringRedisTemplate stringRedisTemplate;

    // 添加一个构造器
    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // 1 获取token(请求头中的)
        // 这一步需要前端把token保存到请求头中
        String token = request.getHeader("authorization");
        if(StringUtil.isNullOrEmpty(token)){
            // 不需要拦截 返回true 直接放行 后面还有一个拦截器
            return true;
        }

        // 2 基于token获取redis中的用户
        // 只用 get 只能取出一个
        // 用entrise  取出的是一个map
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(LOGIN_USER_KEY+token);
        // 3 判断用户是否存在
        if (userMap.isEmpty()){
            // 不需要拦截 返回true 直接放行 后面还有一个拦截器
            return true;
        }

        // 5 将查询到的Map对象转为UserDto
        // 忽略转换过程的错误：肯定不忽略
        UserUpdateInfoDTO userUpdateInfoDTO = BeanUtil.fillBeanWithMap(userMap, new UserUpdateInfoDTO(),false);

        // 6 存在 保存用户信息到Threadlocal中
        UserHolder.saveUser(userUpdateInfoDTO);

        // 7 刷新token有效期
        stringRedisTemplate.expire(LOGIN_USER_KEY+token,LOGIN_USER_TTL, TimeUnit.MINUTES);

        // 8 放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

        // 移除用户
        UserHolder.removeUser();
    }
}

