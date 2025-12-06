package com.epms.service;

import com.epms.entity.EmpTrainingRelation;
import com.epms.entity.TrainingCourse;
import com.epms.vo.TrainingRecordVO;

import java.util.List;

/**
 * 培训服务接口
 */
public interface TrainingService {
    
    // ========== 课程管理 ==========
    
    /**
     * 查询所有课程
     */
    List<TrainingCourse> getAllCourses();
    
    /**
     * 根据ID查询课程
     */
    TrainingCourse getCourseById(Integer courseId);
    
    /**
     * 新增课程
     */
    void addCourse(TrainingCourse course);
    
    /**
     * 更新课程
     */
    void updateCourse(Integer courseId, TrainingCourse course);
    
    /**
     * 删除课程
     */
    void deleteCourse(Integer courseId);
    
    // ========== 培训记录管理 ==========
    
    /**
     * 查询所有培训记录
     */
    List<TrainingRecordVO> getAllTrainingRecords();
    
    /**
     * 根据员工ID查询培训记录
     */
    List<TrainingRecordVO> getTrainingRecordsByEmployeeId(Integer empId);
    
    /**
     * 员工报名课程（新增培训记录）
     */
    void enrollEmployee(EmpTrainingRelation relation);
    
    /**
     * 更新培训记录（更新成绩、完成状态等）
     */
    void updateTrainingRecord(Integer empId, Integer courseId, EmpTrainingRelation relation);
    
    /**
     * 删除培训记录
     */
    void deleteTrainingRecord(Integer empId, Integer courseId);
}

