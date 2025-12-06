package com.epms.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 培训课程实体类
 * 对应表：training_course
 */
@Data
public class TrainingCourse {
    
    private Integer courseId;           // 课程编号
    private String courseName;          // 课程名称
    private LocalDateTime startTime;    // 开始时间
    private LocalDateTime endTime;      // 结束时间
    private String location;            // 地点
    private String trainer;             // 培训师
}

