package com.epms.service;

import com.epms.dto.LoginDTO;
import com.epms.dto.LoginResponseDTO;

import java.util.Map;

/**
 * 认证服务接口
 */
public interface AuthService {
    
    /**
     * 用户登录
     */
    LoginResponseDTO login(LoginDTO loginDTO);
    
    /**
     * 获取当前用户信息（从Token中解析）
     */
    Map<String, Object> getCurrentUser(String token);
}

