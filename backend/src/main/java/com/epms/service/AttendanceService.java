package com.epms.service;

import com.epms.dto.BatchAttendanceDTO;
import com.epms.entity.Attendance;
import com.epms.vo.AttendanceMonthlyStatsVO;
import com.epms.vo.AttendanceVO;

import java.util.List;
import java.util.Map;

/**
 * 考勤服务接口
 */
public interface AttendanceService {
    
    /**
     * 查询所有考勤记录
     */
    List<AttendanceVO> getAllAttendances();
    
    /**
     * 根据ID查询考勤
     */
    AttendanceVO getAttendanceById(Long recordId);
    
    /**
     * 新增考勤记录
     */
    void addAttendance(Attendance attendance);
    
    /**
     * 更新考勤记录
     */
    void updateAttendance(Long recordId, Attendance attendance);
    
    /**
     * 删除考勤记录
     */
    void deleteAttendance(Long recordId);
    
    /**
     * 查询月度考勤统计（使用视图 v_attendance_monthly_stats）
     */
    List<AttendanceMonthlyStatsVO> getMonthlyStats(String month);
    
    /**
     * 批量考勤录入（调用存储过程 sp_batch_attendance）
     */
    Map<String, Object> batchCreate(BatchAttendanceDTO dto);
    
    /**
     * 部门考勤汇总（调用存储过程 sp_dept_attendance_summary）
     */
    List<Map<String, Object>> getDeptSummary(Integer deptId, String month);
}

