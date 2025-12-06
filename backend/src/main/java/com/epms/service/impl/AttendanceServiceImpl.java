package com.epms.service.impl;

import com.epms.dto.BatchAttendanceDTO;
import com.epms.entity.Attendance;
import com.epms.exception.BusinessException;
import com.epms.mapper.AttendanceMapper;
import com.epms.service.AttendanceService;
import com.epms.vo.AttendanceMonthlyStatsVO;
import com.epms.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 考勤服务实现类
 */
@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    
    private final AttendanceMapper attendanceMapper;
    
    @Override
    public List<AttendanceVO> getAllAttendances() {
        return attendanceMapper.selectAll();
    }
    
    @Override
    public AttendanceVO getAttendanceById(Long recordId) {
        AttendanceVO attendance = attendanceMapper.selectById(recordId);
        if (attendance == null) {
            throw new BusinessException("考勤记录不存在");
        }
        return attendance;
    }
    
    @Override
    @Transactional
    public void addAttendance(Attendance attendance) {
        int rows = attendanceMapper.insert(attendance);
        if (rows == 0) {
            throw new BusinessException("新增考勤记录失败");
        }
    }
    
    @Override
    @Transactional
    public void updateAttendance(Long recordId, Attendance attendance) {
        attendance.setRecordId(recordId);
        int rows = attendanceMapper.update(attendance);
        if (rows == 0) {
            throw new BusinessException("更新考勤记录失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteAttendance(Long recordId) {
        int rows = attendanceMapper.delete(recordId);
        if (rows == 0) {
            throw new BusinessException("删除考勤记录失败");
        }
    }
    
    @Override
    public List<AttendanceMonthlyStatsVO> getMonthlyStats(String month) {
        return attendanceMapper.selectMonthlyStats(month);
    }
    
    @Override
    @Transactional
    public Map<String, Object> batchCreate(BatchAttendanceDTO dto) {
        // 调用存储过程
        attendanceMapper.callBatchAttendance(dto);
        
        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "批量录入成功，影响 " + dto.getAffectedRows() + " 条记录");
        result.put("affected_rows", dto.getAffectedRows());
        result.put("p_affected_rows", dto.getAffectedRows());
        
        return result;
    }
    
    @Override
    public List<Map<String, Object>> getDeptSummary(Integer deptId, String month) {
        return attendanceMapper.callDeptAttendanceSummary(deptId, month);
    }
}

