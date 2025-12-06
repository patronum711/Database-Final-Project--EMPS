package com.epms.controller;

import com.epms.common.Result;
import com.epms.service.JobChangeService;
import com.epms.vo.JobChangeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 人事变动控制器
 */
@RestController
@RequestMapping("/job-changes")
@RequiredArgsConstructor
public class JobChangeController {
    
    private final JobChangeService jobChangeService;
    
    /**
     * 查询所有人事变动记录
     */
    @GetMapping
    public Result<List<JobChangeVO>> getAllJobChanges(
            @RequestParam(required = false) Integer empId,
            @RequestParam(required = false) String changeType) {
        List<JobChangeVO> jobChanges;
        if (empId != null || (changeType != null && !changeType.isEmpty())) {
            jobChanges = jobChangeService.getJobChangesByCondition(empId, changeType);
        } else {
            jobChanges = jobChangeService.getAllJobChanges();
        }
        return Result.success(jobChanges);
    }
    
    /**
     * 根据ID查询人事变动记录
     */
    @GetMapping("/{id}")
    public Result<JobChangeVO> getJobChangeById(@PathVariable("id") Integer changeId) {
        JobChangeVO jobChange = jobChangeService.getJobChangeById(changeId);
        return Result.success(jobChange);
    }
    
    /**
     * 根据员工ID查询人事变动记录
     */
    @GetMapping("/employee/{empId}")
    public Result<List<JobChangeVO>> getJobChangesByEmployeeId(@PathVariable("empId") Integer empId) {
        List<JobChangeVO> jobChanges = jobChangeService.getJobChangesByEmployeeId(empId);
        return Result.success(jobChanges);
    }
}

