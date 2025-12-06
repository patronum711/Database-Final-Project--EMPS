package com.epms.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 考勤实体类
 * 对应表：attendance
 */
@Data
public class Attendance {
    
    private Long recordId;          // 记录编号
    private Integer empId;          // 员工工号
    private LocalDate workDate;     // 工作日期
    private String type;            // 类型（正常/迟到/早退/旷工/请假/出差）
    private BigDecimal hours;       // 时长
    private String remarks;         // 备注
}

