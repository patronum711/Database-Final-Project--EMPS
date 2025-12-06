package com.epms.controller;

import com.epms.common.Result;
import com.epms.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 薪资控制器
 */
@RestController
@RequestMapping("/salary")
@RequiredArgsConstructor
public class SalaryController {
    
    private final SalaryService salaryService;
    
    /**
     * 计算月度工资（调用存储过程 sp_calc_monthly_salary）
     * @param month 月份，格式：YYYY-MM，例如：2024-12
     */
    @GetMapping("/calculate")
    public Result<List<Map<String, Object>>> calculateMonthlySalary(@RequestParam("month") String month) {
        List<Map<String, Object>> salaries = salaryService.calculateMonthlySalary(month);
        return Result.success(salaries);
    }
    
    /**
     * 查询指定员工的月度工资
     * @param empId 员工ID
     * @param month 月份，格式：YYYY-MM
     */
    @GetMapping("/employee/{empId}")
    public Result<Map<String, Object>> getEmployeeSalary(
            @PathVariable("empId") Integer empId,
            @RequestParam("month") String month) {
        Map<String, Object> salary = salaryService.getEmployeeSalary(empId, month);
        if (salary == null) {
            return Result.error("未找到该员工的工资记录");
        }
        return Result.success(salary);
    }
}

