package com.epms.service.impl;

import com.epms.dto.LoginDTO;
import com.epms.dto.LoginResponseDTO;
import com.epms.entity.SysUser;
import com.epms.exception.BusinessException;
import com.epms.mapper.SysUserMapper;
import com.epms.service.AuthService;
import com.epms.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证服务实现类
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final SysUserMapper sysUserMapper;
    private final JwtUtil jwtUtil;
    
    @Override
    public LoginResponseDTO login(LoginDTO loginDTO) {
        // 查询用户
        SysUser user = sysUserMapper.selectByUsername(loginDTO.getUsername());
        
        if (user == null) {
            throw new BusinessException("用户名或密码错误");
        }
        
        // 验证密码（简化处理，实际应该加密比对）
        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }
        
        // 生成Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        
        // 构造响应
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setRelatedEmpId(user.getRelatedEmpId());
        
        return response;
    }
    
    @Override
    public Map<String, Object> getCurrentUser(String token) {
        if (token == null || token.isEmpty()) {
            throw new BusinessException("未提供Token");
        }
        
        // 移除Bearer前缀（如果存在）
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // 验证Token
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException("Token无效或已过期");
        }
        
        // 从Token中获取用户信息
        String username = jwtUtil.getUsernameFromToken(token);
        
        // 查询用户详细信息
        SysUser user = sysUserMapper.selectByUsername(username);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 构造返回数据（使用数据库中的最新信息）
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("role", user.getRole());
        userInfo.put("relatedEmpId", user.getRelatedEmpId());
        
        return userInfo;
    }
}

