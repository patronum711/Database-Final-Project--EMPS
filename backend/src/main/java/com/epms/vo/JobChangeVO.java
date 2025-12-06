package com.epms.vo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 人事变动视图对象
 */
@Data
public class JobChangeVO {
    
    private Integer changeId;
    private Integer empId;
    private String empName;             // 员工姓名
    private String changeType;
    private String oldDeptName;
    private String newDeptName;
    private String oldPosName;
    private String newPosName;
    private LocalDateTime changeDate;
    private String remarks;
}

