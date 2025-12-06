package com.epms.entity;

import lombok.Data;
import java.time.LocalDate;

/**
 * 合同实体类
 * 对应表：contract
 */
@Data
public class Contract {
    
    private Integer contractId;     // 合同编号
    private Integer empId;          // 员工工号
    private String type;            // 合同类型（固定期限/无固定期限/实习）
    private LocalDate startDate;    // 开始日期
    private LocalDate endDate;      // 结束日期
    private String status;          // 状态（有效/过期/解除）
}

