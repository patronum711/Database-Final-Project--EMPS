package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 考勤视图对象
 */
@Data
public class AttendanceVO {
    
    private Long recordId;
    private Integer empId;
    private String empName;          // 员工姓名
    private LocalDate workDate;
    private String type;
    private BigDecimal hours;
    private String remarks;
}

