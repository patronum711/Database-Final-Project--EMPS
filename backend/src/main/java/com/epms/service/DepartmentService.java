package com.epms.service;

import com.epms.entity.Department;
import com.epms.vo.DepartmentStatsVO;

import java.math.BigDecimal;
import java.util.List;

/**
 * 部门服务接口
 */
public interface DepartmentService {
    
    /**
     * 查询所有部门
     */
    List<Department> getAllDepartments();
    
    /**
     * 根据ID查询部门
     */
    Department getDepartmentById(Integer deptId);
    
    /**
     * 新增部门
     */
    void addDepartment(Department department);
    
    /**
     * 更新部门
     */
    void updateDepartment(Integer deptId, Department department);
    
    /**
     * 删除部门
     */
    void deleteDepartment(Integer deptId);
    
    /**
     * 查询部门统计（使用视图 v_dept_employee_stats）
     */
    List<DepartmentStatsVO> getDepartmentStats();
    
    /**
     * 查询部门平均工资（使用函数 fn_dept_avg_salary）
     */
    BigDecimal getDepartmentAvgSalary(Integer deptId);
}

