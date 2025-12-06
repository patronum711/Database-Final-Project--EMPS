package com.epms.controller;

import com.epms.common.Result;
import com.epms.dto.EmployeePerformanceDTO;
import com.epms.entity.Employee;
import com.epms.service.EmployeeService;
import com.epms.vo.EmployeeComprehensiveVO;
import com.epms.vo.EmployeeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 员工控制器
 */
@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    /**
     * 查询所有员工
     */
    @GetMapping
    public Result<List<EmployeeVO>> getAllEmployees() {
        List<EmployeeVO> employees = employeeService.getAllEmployees();
        return Result.success(employees);
    }
    
    /**
     * 根据ID查询员工
     */
    @GetMapping("/{id}")
    public Result<EmployeeVO> getEmployeeById(@PathVariable("id") Integer empId) {
        EmployeeVO employee = employeeService.getEmployeeById(empId);
        return Result.success(employee);
    }
    
    /**
     * 新增员工
     */
    @PostMapping
    public Result<Void> addEmployee(@RequestBody Employee employee) {
        employeeService.addEmployee(employee);
        return Result.success("新增员工成功", null);
    }
    
    /**
     * 更新员工
     */
    @PutMapping("/{id}")
    public Result<Void> updateEmployee(@PathVariable("id") Integer empId, @RequestBody Employee employee) {
        employeeService.updateEmployee(empId, employee);
        return Result.success("更新员工成功", null);
    }
    
    /**
     * 删除员工
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteEmployee(@PathVariable("id") Integer empId) {
        employeeService.deleteEmployee(empId);
        return Result.success("删除员工成功", null);
    }
    
    // ========== 数据库功能接口 ==========
    
    /**
     * 查询安全视图（使用 v_emp_safe_profile）
     */
    @GetMapping("/safe-profile")
    public Result<List<EmployeeVO>> getSafeProfile() {
        List<EmployeeVO> employees = employeeService.getSafeProfile();
        return Result.success(employees);
    }
    
    /**
     * 查询综合信息（使用 v_employee_comprehensive）
     */
    @GetMapping("/comprehensive")
    public Result<List<EmployeeComprehensiveVO>> getComprehensive() {
        List<EmployeeComprehensiveVO> employees = employeeService.getComprehensive();
        return Result.success(employees);
    }
    
    /**
     * 根据ID查询综合信息
     */
    @GetMapping("/{id}/comprehensive")
    public Result<EmployeeComprehensiveVO> getComprehensiveById(@PathVariable("id") Integer empId) {
        EmployeeComprehensiveVO employee = employeeService.getComprehensiveById(empId);
        return Result.success(employee);
    }
    
    /**
     * 员工转正（调用存储过程 sp_employee_confirmation）
     */
    @PostMapping("/{id}/confirm")
    public Result<Map<String, Object>> confirmEmployee(@PathVariable("id") Integer empId) {
        Map<String, Object> result = employeeService.confirmEmployee(empId);
        return Result.success(result);
    }
    
    /**
     * 查询员工绩效（调用存储过程 sp_employee_performance）
     */
    @GetMapping("/{id}/performance")
    public Result<EmployeePerformanceDTO> getPerformance(
            @PathVariable("id") Integer empId,
            @RequestParam("month") String month) {
        EmployeePerformanceDTO performance = employeeService.getPerformance(empId, month);
        return Result.success(performance);
    }
}

