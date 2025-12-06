package com.epms.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 职位实体类
 * 对应表：position
 */
@Data
public class Position {
    
    private Integer posId;              // 职位编号
    private String posName;             // 职位名称
    private BigDecimal baseSalary;      // 基本工资
    private String level;               // 职级
}

