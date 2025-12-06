package com.epms.service.impl;

import com.epms.exception.BusinessException;
import com.epms.mapper.JobChangeMapper;
import com.epms.service.JobChangeService;
import com.epms.vo.JobChangeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 人事变动服务实现类
 */
@Service
@RequiredArgsConstructor
public class JobChangeServiceImpl implements JobChangeService {
    
    private final JobChangeMapper jobChangeMapper;
    
    @Override
    public List<JobChangeVO> getAllJobChanges() {
        return jobChangeMapper.selectAll();
    }
    
    @Override
    public JobChangeVO getJobChangeById(Integer changeId) {
        JobChangeVO jobChange = jobChangeMapper.selectById(changeId);
        if (jobChange == null) {
            throw new BusinessException("人事变动记录不存在");
        }
        return jobChange;
    }
    
    @Override
    public List<JobChangeVO> getJobChangesByEmployeeId(Integer empId) {
        return jobChangeMapper.selectByEmployeeId(empId);
    }
    
    @Override
    public List<JobChangeVO> getJobChangesByCondition(Integer empId, String changeType) {
        return jobChangeMapper.selectByCondition(empId, changeType);
    }
}

