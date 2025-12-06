package com.epms.controller;

import com.epms.common.Result;
import com.epms.entity.EmpTrainingRelation;
import com.epms.entity.TrainingCourse;
import com.epms.service.TrainingService;
import com.epms.vo.TrainingRecordVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 培训控制器
 */
@RestController
@RequestMapping("/training")
@RequiredArgsConstructor
public class TrainingController {
    
    private final TrainingService trainingService;
    
    // ========== 课程管理 ==========
    
    /**
     * 查询所有课程
     */
    @GetMapping("/courses")
    public Result<List<TrainingCourse>> getAllCourses() {
        List<TrainingCourse> courses = trainingService.getAllCourses();
        return Result.success(courses);
    }
    
    /**
     * 根据ID查询课程
     */
    @GetMapping("/courses/{id}")
    public Result<TrainingCourse> getCourseById(@PathVariable("id") Integer courseId) {
        TrainingCourse course = trainingService.getCourseById(courseId);
        return Result.success(course);
    }
    
    /**
     * 新增课程
     */
    @PostMapping("/courses")
    public Result<Void> addCourse(@RequestBody TrainingCourse course) {
        trainingService.addCourse(course);
        return Result.success("新增课程成功", null);
    }
    
    /**
     * 更新课程
     */
    @PutMapping("/courses/{id}")
    public Result<Void> updateCourse(@PathVariable("id") Integer courseId, @RequestBody TrainingCourse course) {
        trainingService.updateCourse(courseId, course);
        return Result.success("更新课程成功", null);
    }
    
    /**
     * 删除课程
     */
    @DeleteMapping("/courses/{id}")
    public Result<Void> deleteCourse(@PathVariable("id") Integer courseId) {
        trainingService.deleteCourse(courseId);
        return Result.success("删除课程成功", null);
    }
    
    // ========== 培训记录管理 ==========
    
    /**
     * 查询所有培训记录
     */
    @GetMapping("/records")
    public Result<List<TrainingRecordVO>> getAllTrainingRecords() {
        List<TrainingRecordVO> records = trainingService.getAllTrainingRecords();
        return Result.success(records);
    }
    
    /**
     * 根据员工ID查询培训记录
     */
    @GetMapping("/employee/{empId}")
    public Result<List<TrainingRecordVO>> getTrainingRecordsByEmployeeId(@PathVariable("empId") Integer empId) {
        List<TrainingRecordVO> records = trainingService.getTrainingRecordsByEmployeeId(empId);
        return Result.success(records);
    }
    
    /**
     * 员工报名课程（新增培训记录）
     */
    @PostMapping("/enroll")
    public Result<Void> enrollEmployee(@RequestBody EmpTrainingRelation relation) {
        trainingService.enrollEmployee(relation);
        return Result.success("报名成功", null);
    }
    
    /**
     * 更新培训记录
     */
    @PutMapping("/records/{empId}/{courseId}")
    public Result<Void> updateTrainingRecord(
            @PathVariable("empId") Integer empId,
            @PathVariable("courseId") Integer courseId,
            @RequestBody EmpTrainingRelation relation) {
        trainingService.updateTrainingRecord(empId, courseId, relation);
        return Result.success("更新培训记录成功", null);
    }
    
    /**
     * 删除培训记录
     */
    @DeleteMapping("/records/{empId}/{courseId}")
    public Result<Void> deleteTrainingRecord(
            @PathVariable("empId") Integer empId,
            @PathVariable("courseId") Integer courseId) {
        trainingService.deleteTrainingRecord(empId, courseId);
        return Result.success("删除培训记录成功", null);
    }
}

