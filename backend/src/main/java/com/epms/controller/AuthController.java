package com.epms.controller;

import com.epms.common.Result;
import com.epms.dto.LoginDTO;
import com.epms.dto.LoginResponseDTO;
import com.epms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<LoginResponseDTO> login(@Validated @RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = authService.login(loginDTO);
        return Result.success(response);
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/current")
    public Result<Map<String, Object>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Map<String, Object> userInfo = authService.getCurrentUser(authorization);
        return Result.success(userInfo);
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Result<String> health() {
        return Result.success("EPMS Backend is running!");
    }
}

