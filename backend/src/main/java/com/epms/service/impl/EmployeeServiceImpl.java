package com.epms.service.impl;

import com.epms.dto.EmployeeConfirmationDTO;
import com.epms.dto.EmployeePerformanceDTO;
import com.epms.entity.Employee;
import com.epms.exception.BusinessException;
import com.epms.mapper.EmployeeMapper;
import com.epms.service.EmployeeService;
import com.epms.vo.EmployeeComprehensiveVO;
import com.epms.vo.EmployeeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 员工服务实现类
 */
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    
    private final EmployeeMapper employeeMapper;
    
    @Override
    public List<EmployeeVO> getAllEmployees() {
        return employeeMapper.selectAll();
    }
    
    @Override
    public EmployeeVO getEmployeeById(Integer empId) {
        EmployeeVO employee = employeeMapper.selectById(empId);
        if (employee == null) {
            throw new BusinessException("员工不存在");
        }
        return employee;
    }
    
    @Override
    @Transactional
    public void addEmployee(Employee employee) {
        int rows = employeeMapper.insert(employee);
        if (rows == 0) {
            throw new BusinessException("新增员工失败");
        }
    }
    
    @Override
    @Transactional
    public void updateEmployee(Integer empId, Employee employee) {
        employee.setEmpId(empId);
        int rows = employeeMapper.update(employee);
        if (rows == 0) {
            throw new BusinessException("更新员工失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteEmployee(Integer empId) {
        // 业务逻辑校验：不应该直接删除员工，而是将状态改为"离职"
        // 因为数据库中设置了 ON DELETE CASCADE，直接删除会级联删除所有相关数据
        // 这会导致历史数据丢失（合同、考勤、奖惩、培训等记录）
        
        // 检查员工是否存在
        EmployeeVO employee = employeeMapper.selectById(empId);
        if (employee == null) {
            throw new BusinessException("员工不存在");
        }
        
        // 将员工状态改为"离职"而不是物理删除
        Employee updateEmployee = new Employee();
        updateEmployee.setEmpId(empId);
        updateEmployee.setStatus("离职");
        
        int rows = employeeMapper.update(updateEmployee);
        if (rows == 0) {
            throw new BusinessException("删除员工失败");
        }
    }
    
    @Override
    public List<EmployeeVO> getSafeProfile() {
        return employeeMapper.selectSafeProfile();
    }
    
    @Override
    public List<EmployeeComprehensiveVO> getComprehensive() {
        return employeeMapper.selectComprehensive();
    }
    
    @Override
    public EmployeeComprehensiveVO getComprehensiveById(Integer empId) {
        EmployeeComprehensiveVO vo = employeeMapper.selectComprehensiveById(empId);
        if (vo == null) {
            throw new BusinessException("员工综合信息不存在");
        }
        return vo;
    }
    
    @Override
    @Transactional
    public Map<String, Object> confirmEmployee(Integer empId) {
        EmployeeConfirmationDTO dto = new EmployeeConfirmationDTO();
        dto.setEmpId(empId);
        
        // 调用存储过程
        employeeMapper.callEmployeeConfirmation(dto);
        
        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", dto.getResult());
        result.put("p_result", dto.getResult());
        
        return result;
    }
    
    @Override
    public EmployeePerformanceDTO getPerformance(Integer empId, String month) {
        return employeeMapper.callEmployeePerformance(empId, month);
    }
}

