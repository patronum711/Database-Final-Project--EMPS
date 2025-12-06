package com.epms.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 员工绩效评估DTO
 * 用于存储过程 sp_employee_performance 的输出
 */
@Data
public class EmployeePerformanceDTO {
    
    private Integer empId;
    private String name;
    private BigDecimal baseSalary;          // 基本工资
    private BigDecimal rewardAmount;        // 奖惩金额
    private Integer lateCount;              // 迟到次数
    private Integer absenceCount;           // 旷工次数
    private Integer trainingCompleted;      // 培训完成数
    private BigDecimal workYears;           // 工龄
    private BigDecimal performanceScore;    // 绩效分数
    private String performanceLevel;        // 绩效等级
}

