package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 培训记录视图对象
 */
@Data
public class TrainingRecordVO {
    
    private Integer empId;
    private String empName;
    private Integer courseId;
    private String courseName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String trainer;
    private BigDecimal score;
    private Boolean isCompleted;
}

