package com.epms.dto;

import lombok.Data;

/**
 * 批量考勤录入DTO
 * 用于存储过程 sp_batch_attendance 的输入输出
 */
@Data
public class BatchAttendanceDTO {
    
    // 输入参数
    private Integer deptId;         // 部门ID
    private String workDate;        // 工作日期
    private String type;            // 考勤类型
    
    // 输出参数
    private Integer affectedRows;   // 影响的行数
    
    public BatchAttendanceDTO() {}
    
    public BatchAttendanceDTO(Integer deptId, String workDate, String type) {
        this.deptId = deptId;
        this.workDate = workDate;
        this.type = type;
    }
}

