package com.epms.mapper;

import com.epms.entity.EmpTrainingRelation;
import com.epms.entity.TrainingCourse;
import com.epms.vo.TrainingRecordVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 培训Mapper接口
 */
@Mapper
public interface TrainingMapper {
    
    // ========== 课程管理 ==========
    
    /**
     * 查询所有课程
     */
    List<TrainingCourse> selectAllCourses();
    
    /**
     * 根据ID查询课程
     */
    TrainingCourse selectCourseById(@Param("courseId") Integer courseId);
    
    /**
     * 新增课程
     */
    int insertCourse(TrainingCourse course);
    
    /**
     * 更新课程
     */
    int updateCourse(TrainingCourse course);
    
    /**
     * 删除课程
     */
    int deleteCourse(@Param("courseId") Integer courseId);
    
    // ========== 培训记录管理 ==========
    
    /**
     * 查询所有培训记录（关联员工和课程信息）
     */
    List<TrainingRecordVO> selectAllTrainingRecords();
    
    /**
     * 根据员工ID查询培训记录
     */
    List<TrainingRecordVO> selectTrainingRecordsByEmployeeId(@Param("empId") Integer empId);
    
    /**
     * 根据员工ID和课程ID查询培训记录
     */
    TrainingRecordVO selectTrainingRecord(@Param("empId") Integer empId, @Param("courseId") Integer courseId);
    
    /**
     * 新增培训记录（员工报名课程）
     */
    int insertTrainingRecord(EmpTrainingRelation relation);
    
    /**
     * 更新培训记录
     */
    int updateTrainingRecord(EmpTrainingRelation relation);
    
    /**
     * 删除培训记录
     */
    int deleteTrainingRecord(@Param("empId") Integer empId, @Param("courseId") Integer courseId);
}

