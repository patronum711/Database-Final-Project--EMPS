package com.epms.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 人事变动实体类
 * 对应表：job_change
 */
@Data
public class JobChange {
    
    private Integer changeId;           // 变动编号
    private Integer empId;              // 员工工号
    private String changeType;          // 变动类型（入职/转正/调动/晋升/离职）
    private String oldDeptName;         // 原部门快照
    private String newDeptName;         // 新部门快照
    private String oldPosName;          // 原职位快照
    private String newPosName;          // 新职位快照
    private LocalDateTime changeDate;   // 变动日期
    private String remarks;             // 备注说明
}

