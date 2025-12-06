package com.epms.mapper;

import com.epms.entity.Department;
import com.epms.vo.DepartmentStatsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

/**
 * 部门Mapper接口
 */
@Mapper
public interface DepartmentMapper {
    
    // ========== 基础CRUD ==========
    
    List<Department> selectAll();
    
    Department selectById(@Param("deptId") Integer deptId);
    
    int insert(Department department);
    
    int update(Department department);
    
    int delete(@Param("deptId") Integer deptId);
    
    // ========== 视图查询 ==========
    
    /**
     * 查询部门统计（使用视图 v_dept_employee_stats）
     */
    List<DepartmentStatsVO> selectDepartmentStats();
    
    // ========== 函数调用 ==========
    
    /**
     * 查询部门平均工资（调用函数 fn_dept_avg_salary）
     */
    BigDecimal selectAvgSalary(@Param("deptId") Integer deptId);
}

