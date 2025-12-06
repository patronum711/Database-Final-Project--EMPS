package com.epms.mapper;

import com.epms.dto.BatchAttendanceDTO;
import com.epms.entity.Attendance;
import com.epms.vo.AttendanceMonthlyStatsVO;
import com.epms.vo.AttendanceVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 考勤Mapper接口
 */
@Mapper
public interface AttendanceMapper {
    
    // ========== 基础CRUD ==========
    
    List<AttendanceVO> selectAll();
    
    AttendanceVO selectById(@Param("recordId") Long recordId);
    
    List<AttendanceVO> selectByEmployeeId(@Param("empId") Integer empId);
    
    int insert(Attendance attendance);
    
    int update(Attendance attendance);
    
    int delete(@Param("recordId") Long recordId);
    
    // ========== 视图查询 ==========
    
    /**
     * 查询月度考勤统计（使用视图 v_attendance_monthly_stats）
     */
    List<AttendanceMonthlyStatsVO> selectMonthlyStats(@Param("month") String month);
    
    // ========== 存储过程调用 ==========
    
    /**
     * 批量考勤录入（调用存储过程 sp_batch_attendance）
     */
    void callBatchAttendance(@Param("dto") BatchAttendanceDTO dto);
    
    /**
     * 部门考勤汇总（调用存储过程 sp_dept_attendance_summary）
     */
    List<Map<String, Object>> callDeptAttendanceSummary(@Param("deptId") Integer deptId, 
                                                         @Param("month") String month);
}

