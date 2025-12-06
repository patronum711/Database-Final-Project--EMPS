package com.epms.mapper;

import com.epms.vo.JobChangeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 人事变动Mapper接口
 */
@Mapper
public interface JobChangeMapper {
    
    /**
     * 查询所有人事变动记录
     */
    List<JobChangeVO> selectAll();
    
    /**
     * 根据ID查询人事变动记录
     */
    JobChangeVO selectById(@Param("changeId") Integer changeId);
    
    /**
     * 根据员工ID查询人事变动记录
     */
    List<JobChangeVO> selectByEmployeeId(@Param("empId") Integer empId);
    
    /**
     * 根据条件查询人事变动记录（支持员工ID和变动类型过滤）
     */
    List<JobChangeVO> selectByCondition(@Param("empId") Integer empId, @Param("changeType") String changeType);
}

