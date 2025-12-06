package com.epms.entity;

import lombok.Data;

/**
 * 部门实体类
 * 对应表：department
 */
@Data
public class Department {
    
    private Integer deptId;         // 部门编号
    private String deptName;        // 部门名称
    private String location;        // 地址
}

