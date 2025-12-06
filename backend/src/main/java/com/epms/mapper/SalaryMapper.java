package com.epms.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 薪资Mapper接口
 */
@Mapper
public interface SalaryMapper {
    
    /**
     * 计算月度工资（调用存储过程 sp_calc_monthly_salary）
     * @param month 月份，格式：YYYY-MM
     * @return 工资计算结果列表
     */
    List<Map<String, Object>> calculateMonthlySalary(@Param("month") String month);
}

