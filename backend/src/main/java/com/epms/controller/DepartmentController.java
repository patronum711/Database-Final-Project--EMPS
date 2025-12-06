package com.epms.controller;

import com.epms.common.Result;
import com.epms.entity.Department;
import com.epms.service.DepartmentService;
import com.epms.vo.DepartmentStatsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 部门控制器
 */
@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    /**
     * 查询所有部门
     */
    @GetMapping
    public Result<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return Result.success(departments);
    }
    
    /**
     * 根据ID查询部门
     */
    @GetMapping("/{id}")
    public Result<Department> getDepartmentById(@PathVariable("id") Integer deptId) {
        Department department = departmentService.getDepartmentById(deptId);
        return Result.success(department);
    }
    
    /**
     * 新增部门
     */
    @PostMapping
    public Result<Void> addDepartment(@RequestBody Department department) {
        departmentService.addDepartment(department);
        return Result.success("新增部门成功", null);
    }
    
    /**
     * 更新部门
     */
    @PutMapping("/{id}")
    public Result<Void> updateDepartment(@PathVariable("id") Integer deptId, @RequestBody Department department) {
        departmentService.updateDepartment(deptId, department);
        return Result.success("更新部门成功", null);
    }
    
    /**
     * 删除部门
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteDepartment(@PathVariable("id") Integer deptId) {
        departmentService.deleteDepartment(deptId);
        return Result.success("删除部门成功", null);
    }
    
    // ========== 数据库功能接口 ==========
    
    /**
     * 查询部门统计（使用视图 v_dept_employee_stats）
     */
    @GetMapping("/stats")
    public Result<List<DepartmentStatsVO>> getDepartmentStats() {
        List<DepartmentStatsVO> stats = departmentService.getDepartmentStats();
        return Result.success(stats);
    }
    
    /**
     * 查询部门平均工资（使用函数 fn_dept_avg_salary）
     */
    @GetMapping("/{id}/avg-salary")
    public Result<Map<String, Object>> getDepartmentAvgSalary(@PathVariable("id") Integer deptId) {
        BigDecimal avgSalary = departmentService.getDepartmentAvgSalary(deptId);
        Map<String, Object> result = new HashMap<>();
        result.put("dept_id", deptId);
        result.put("avg_salary", avgSalary);
        return Result.success(result);
    }
}

