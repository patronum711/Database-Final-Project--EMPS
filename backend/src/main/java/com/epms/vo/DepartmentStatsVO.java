package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 部门统计视图对象
 * 对应数据库视图：v_dept_employee_stats
 */
@Data
public class DepartmentStatsVO {
    
    private Integer deptId;                 // 部门ID
    private String deptName;                // 部门名称
    private String location;                // 地址
    private Integer totalEmployees;         // 总人数
    private Integer activeEmployees;        // 在职人数
    private Integer probationEmployees;     // 试用期人数
    private Integer resignedEmployees;      // 离职人数
    private BigDecimal avgDeptSalary;       // 部门平均工资
    private BigDecimal maxDeptSalary;       // 部门最高工资
    private BigDecimal minDeptSalary;       // 部门最低工资
}

