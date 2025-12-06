package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 月度考勤统计视图对象
 * 对应数据库视图：v_attendance_monthly_stats
 */
@Data
public class AttendanceMonthlyStatsVO {
    
    private Integer empId;
    private String name;
    private String deptName;
    private String month;               // 月份（YYYY-MM）
    private Integer totalRecords;       // 总记录数
    private Integer normalDays;         // 正常天数
    private Integer lateCount;          // 迟到次数
    private Integer earlyLeaveCount;    // 早退次数
    private Integer absenceCount;       // 旷工次数
    private Integer leaveCount;         // 请假次数
    private Integer businessTripCount;  // 出差次数
    private BigDecimal totalHours;      // 总工时
    private Integer abnormalCount;      // 异常次数
}

