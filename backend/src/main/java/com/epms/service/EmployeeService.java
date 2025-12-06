package com.epms.service;

import com.epms.dto.EmployeePerformanceDTO;
import com.epms.entity.Employee;
import com.epms.vo.EmployeeComprehensiveVO;
import com.epms.vo.EmployeeVO;

import java.util.List;
import java.util.Map;

/**
 * 员工服务接口
 */
public interface EmployeeService {
    
    // ========== 基础CRUD ==========
    
    /**
     * 查询所有员工
     */
    List<EmployeeVO> getAllEmployees();
    
    /**
     * 根据ID查询员工
     */
    EmployeeVO getEmployeeById(Integer empId);
    
    /**
     * 新增员工
     */
    void addEmployee(Employee employee);
    
    /**
     * 更新员工
     */
    void updateEmployee(Integer empId, Employee employee);
    
    /**
     * 删除员工
     */
    void deleteEmployee(Integer empId);
    
    // ========== 视图查询 ==========
    
    /**
     * 查询安全视图（使用 v_emp_safe_profile）
     */
    List<EmployeeVO> getSafeProfile();
    
    /**
     * 查询综合信息（使用 v_employee_comprehensive）
     */
    List<EmployeeComprehensiveVO> getComprehensive();
    
    /**
     * 根据ID查询综合信息
     */
    EmployeeComprehensiveVO getComprehensiveById(Integer empId);
    
    // ========== 存储过程调用 ==========
    
    /**
     * 员工转正（调用存储过程 sp_employee_confirmation）
     */
    Map<String, Object> confirmEmployee(Integer empId);
    
    /**
     * 查询员工绩效（调用存储过程 sp_employee_performance）
     */
    EmployeePerformanceDTO getPerformance(Integer empId, String month);
}

