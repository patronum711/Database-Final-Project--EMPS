package com.epms.entity;

import lombok.Data;

/**
 * 系统用户实体类
 * 对应表：sys_user
 */
@Data
public class SysUser {
    
    private Integer userId;         // 用户编号
    private String username;        // 用户名
    private String password;        // 密码
    private String role;            // 角色（ADMIN/HR）
    private Integer relatedEmpId;   // 关联员工编号
}

