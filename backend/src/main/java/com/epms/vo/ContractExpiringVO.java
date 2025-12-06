package com.epms.vo;

import lombok.Data;
import java.time.LocalDate;

/**
 * 合同到期预警视图对象
 * 对应数据库视图：v_contract_expiring_soon
 */
@Data
public class ContractExpiringVO {
    
    private Integer contractId;     // 合同ID
    private Integer empId;          // 员工ID
    private String empName;         // 员工姓名
    private String deptName;        // 部门名称
    private String posName;         // 职位名称
    private String contractType;    // 合同类型
    private LocalDate startDate;    // 开始日期
    private LocalDate endDate;      // 结束日期
    private Integer daysRemaining;  // 剩余天数
    private String alertLevel;      // 预警级别（紧急/重要/注意）
}

