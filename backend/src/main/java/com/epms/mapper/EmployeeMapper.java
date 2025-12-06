package com.epms.mapper;

import com.epms.dto.EmployeeConfirmationDTO;
import com.epms.dto.EmployeePerformanceDTO;
import com.epms.entity.Employee;
import com.epms.vo.EmployeeComprehensiveVO;
import com.epms.vo.EmployeeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 员工Mapper接口
 */
@Mapper
public interface EmployeeMapper {
    
    // ========== 基础CRUD ==========
    
    /**
     * 查询所有员工
     */
    List<EmployeeVO> selectAll();
    
    /**
     * 根据ID查询员工
     */
    EmployeeVO selectById(@Param("empId") Integer empId);
    
    /**
     * 插入员工
     */
    int insert(Employee employee);
    
    /**
     * 更新员工
     */
    int update(Employee employee);
    
    /**
     * 删除员工
     */
    int delete(@Param("empId") Integer empId);
    
    // ========== 视图查询 ==========
    
    /**
     * 查询安全视图（使用 v_emp_safe_profile，身份证脱敏）
     */
    List<EmployeeVO> selectSafeProfile();
    
    /**
     * 查询综合信息（使用 v_employee_comprehensive）
     */
    List<EmployeeComprehensiveVO> selectComprehensive();
    
    /**
     * 根据ID查询综合信息
     */
    EmployeeComprehensiveVO selectComprehensiveById(@Param("empId") Integer empId);
    
    // ========== 存储过程调用 ==========
    
    /**
     * 员工转正（调用存储过程 sp_employee_confirmation）
     */
    void callEmployeeConfirmation(@Param("dto") EmployeeConfirmationDTO dto);
    
    /**
     * 查询员工绩效（调用存储过程 sp_employee_performance）
     */
    EmployeePerformanceDTO callEmployeePerformance(@Param("empId") Integer empId, @Param("month") String month);
}

