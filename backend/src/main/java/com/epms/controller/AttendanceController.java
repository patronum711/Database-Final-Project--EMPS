package com.epms.controller;

import com.epms.common.Result;
import com.epms.dto.BatchAttendanceDTO;
import com.epms.entity.Attendance;
import com.epms.service.AttendanceService;
import com.epms.vo.AttendanceMonthlyStatsVO;
import com.epms.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 考勤控制器
 */
@RestController
@RequestMapping("/attendances")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    /**
     * 查询所有考勤记录
     */
    @GetMapping
    public Result<List<AttendanceVO>> getAllAttendances() {
        List<AttendanceVO> attendances = attendanceService.getAllAttendances();
        return Result.success(attendances);
    }
    
    /**
     * 根据ID查询考勤
     */
    @GetMapping("/{id}")
    public Result<AttendanceVO> getAttendanceById(@PathVariable("id") Long recordId) {
        AttendanceVO attendance = attendanceService.getAttendanceById(recordId);
        return Result.success(attendance);
    }
    
    /**
     * 新增考勤记录
     */
    @PostMapping
    public Result<Void> addAttendance(@RequestBody Attendance attendance) {
        attendanceService.addAttendance(attendance);
        return Result.success("新增考勤记录成功", null);
    }
    
    /**
     * 更新考勤记录
     */
    @PutMapping("/{id}")
    public Result<Void> updateAttendance(@PathVariable("id") Long recordId, @RequestBody Attendance attendance) {
        attendanceService.updateAttendance(recordId, attendance);
        return Result.success("更新考勤记录成功", null);
    }
    
    /**
     * 删除考勤记录
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteAttendance(@PathVariable("id") Long recordId) {
        attendanceService.deleteAttendance(recordId);
        return Result.success("删除考勤记录成功", null);
    }
    
    // ========== 数据库功能接口 ==========
    
    /**
     * 查询月度考勤统计（使用视图 v_attendance_monthly_stats）
     */
    @GetMapping("/monthly-stats")
    public Result<List<AttendanceMonthlyStatsVO>> getMonthlyStats(@RequestParam("month") String month) {
        List<AttendanceMonthlyStatsVO> stats = attendanceService.getMonthlyStats(month);
        return Result.success(stats);
    }
    
    /**
     * 批量考勤录入（调用存储过程 sp_batch_attendance）
     */
    @PostMapping("/batch")
    public Result<Map<String, Object>> batchCreate(@RequestBody BatchAttendanceDTO dto) {
        Map<String, Object> result = attendanceService.batchCreate(dto);
        return Result.success(result);
    }
    
    /**
     * 部门考勤汇总（调用存储过程 sp_dept_attendance_summary）
     */
    @GetMapping("/dept-summary")
    public Result<List<Map<String, Object>>> getDeptSummary(
            @RequestParam(value = "deptId", required = false) Integer deptId,
            @RequestParam("month") String month) {
        List<Map<String, Object>> summary = attendanceService.getDeptSummary(deptId, month);
        return Result.success(summary);
    }
}

