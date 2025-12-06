package com.epms.service.impl;

import com.epms.mapper.SalaryMapper;
import com.epms.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 薪资服务实现类
 */
@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {
    
    private final SalaryMapper salaryMapper;
    
    @Override
    public List<Map<String, Object>> calculateMonthlySalary(String month) {
        return salaryMapper.calculateMonthlySalary(month);
    }
    
    @Override
    public Map<String, Object> getEmployeeSalary(Integer empId, String month) {
        List<Map<String, Object>> allSalaries = salaryMapper.calculateMonthlySalary(month);
        return allSalaries.stream()
                .filter(salary -> {
                    Object id = salary.get("emp_id");
                    return id != null && id.toString().equals(empId.toString());
                })
                .findFirst()
                .orElse(null);
    }
}

