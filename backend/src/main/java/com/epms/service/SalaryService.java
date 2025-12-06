package com.epms.service;

import java.util.List;
import java.util.Map;

/**
 * 薪资服务接口
 */
public interface SalaryService {
    
    /**
     * 计算月度工资（调用存储过程 sp_calc_monthly_salary）
     * @param month 月份，格式：YYYY-MM
     * @return 工资计算结果列表，每个Map包含：emp_id, name, 基本工资, 奖惩绩效, 考勤扣款, 实发工资
     */
    List<Map<String, Object>> calculateMonthlySalary(String month);
    
    /**
     * 查询指定员工的月度工资
     * @param empId 员工ID
     * @param month 月份，格式：YYYY-MM
     * @return 工资计算结果
     */
    Map<String, Object> getEmployeeSalary(Integer empId, String month);
}

