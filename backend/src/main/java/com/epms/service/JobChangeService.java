package com.epms.service;

import com.epms.vo.JobChangeVO;

import java.util.List;

/**
 * 人事变动服务接口
 */
public interface JobChangeService {
    
    /**
     * 查询所有人事变动记录
     */
    List<JobChangeVO> getAllJobChanges();
    
    /**
     * 根据ID查询人事变动记录
     */
    JobChangeVO getJobChangeById(Integer changeId);
    
    /**
     * 根据员工ID查询人事变动记录
     */
    List<JobChangeVO> getJobChangesByEmployeeId(Integer empId);
    
    /**
     * 根据条件查询人事变动记录
     */
    List<JobChangeVO> getJobChangesByCondition(Integer empId, String changeType);
}

