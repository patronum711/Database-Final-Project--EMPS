package com.epms.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 员工培训关联实体类
 * 对应表：emp_training_relation
 */
@Data
public class EmpTrainingRelation {
    
    private Integer empId;          // 员工工号
    private Integer courseId;       // 课程编号
    private BigDecimal score;       // 考核成绩
    private Boolean isCompleted;    // 是否完成
}

