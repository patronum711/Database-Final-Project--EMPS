package com.epms.dto;

import lombok.Data;

/**
 * 登录响应DTO
 */
@Data
public class LoginResponseDTO {
    
    private String token;
    private String username;
    private String role;
    private Integer relatedEmpId;
    
    public LoginResponseDTO() {}
    
    public LoginResponseDTO(String token, String username, String role, Integer relatedEmpId) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.relatedEmpId = relatedEmpId;
    }
}

