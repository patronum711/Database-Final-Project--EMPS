package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 员工综合信息视图对象
 * 对应数据库视图：v_employee_comprehensive
 */
@Data
public class EmployeeComprehensiveVO {
    
    // 基本信息
    private Integer empId;
    private String name;
    private String gender;
    private String phone;
    private LocalDate hireDate;
    private String status;
    
    // 部门职位信息
    private String deptName;
    private String posName;
    private BigDecimal baseSalary;
    private String level;
    
    // 工龄信息（由数据库函数计算）
    private Integer workMonths;
    private Integer workYears;
    
    // 合同信息
    private Integer contractCount;
    private LocalDate currentContractEnd;
    
    // 考勤信息
    private Integer recentAttendanceCount;
    
    // 培训信息
    private Integer trainingCount;
    private Integer completedTrainingCount;
}

