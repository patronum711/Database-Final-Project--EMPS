package com.epms.service.impl;

import com.epms.entity.EmpTrainingRelation;
import com.epms.entity.TrainingCourse;
import com.epms.exception.BusinessException;
import com.epms.mapper.TrainingMapper;
import com.epms.service.TrainingService;
import com.epms.vo.TrainingRecordVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 培训服务实现类
 */
@Service
@RequiredArgsConstructor
public class TrainingServiceImpl implements TrainingService {
    
    private final TrainingMapper trainingMapper;
    
    // ========== 课程管理 ==========
    
    @Override
    public List<TrainingCourse> getAllCourses() {
        return trainingMapper.selectAllCourses();
    }
    
    @Override
    public TrainingCourse getCourseById(Integer courseId) {
        TrainingCourse course = trainingMapper.selectCourseById(courseId);
        if (course == null) {
            throw new BusinessException("课程不存在");
        }
        return course;
    }
    
    @Override
    @Transactional
    public void addCourse(TrainingCourse course) {
        int rows = trainingMapper.insertCourse(course);
        if (rows == 0) {
            throw new BusinessException("新增课程失败");
        }
    }
    
    @Override
    @Transactional
    public void updateCourse(Integer courseId, TrainingCourse course) {
        course.setCourseId(courseId);
        int rows = trainingMapper.updateCourse(course);
        if (rows == 0) {
            throw new BusinessException("更新课程失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteCourse(Integer courseId) {
        int rows = trainingMapper.deleteCourse(courseId);
        if (rows == 0) {
            throw new BusinessException("删除课程失败");
        }
    }
    
    // ========== 培训记录管理 ==========
    
    @Override
    public List<TrainingRecordVO> getAllTrainingRecords() {
        return trainingMapper.selectAllTrainingRecords();
    }
    
    @Override
    public List<TrainingRecordVO> getTrainingRecordsByEmployeeId(Integer empId) {
        return trainingMapper.selectTrainingRecordsByEmployeeId(empId);
    }
    
    @Override
    @Transactional
    public void enrollEmployee(EmpTrainingRelation relation) {
        // 检查是否已报名
        TrainingRecordVO existing = trainingMapper.selectTrainingRecord(relation.getEmpId(), relation.getCourseId());
        if (existing != null) {
            throw new BusinessException("该员工已报名此课程");
        }
        
        int rows = trainingMapper.insertTrainingRecord(relation);
        if (rows == 0) {
            throw new BusinessException("报名失败");
        }
    }
    
    @Override
    @Transactional
    public void updateTrainingRecord(Integer empId, Integer courseId, EmpTrainingRelation relation) {
        relation.setEmpId(empId);
        relation.setCourseId(courseId);
        int rows = trainingMapper.updateTrainingRecord(relation);
        if (rows == 0) {
            throw new BusinessException("更新培训记录失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteTrainingRecord(Integer empId, Integer courseId) {
        int rows = trainingMapper.deleteTrainingRecord(empId, courseId);
        if (rows == 0) {
            throw new BusinessException("删除培训记录失败");
        }
    }
}

