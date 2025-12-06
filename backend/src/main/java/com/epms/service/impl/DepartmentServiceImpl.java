package com.epms.service.impl;

import com.epms.entity.Department;
import com.epms.exception.BusinessException;
import com.epms.mapper.DepartmentMapper;
import com.epms.service.DepartmentService;
import com.epms.vo.DepartmentStatsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 部门服务实现类
 */
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    
    private final DepartmentMapper departmentMapper;
    
    @Override
    public List<Department> getAllDepartments() {
        return departmentMapper.selectAll();
    }
    
    @Override
    public Department getDepartmentById(Integer deptId) {
        Department department = departmentMapper.selectById(deptId);
        if (department == null) {
            throw new BusinessException("部门不存在");
        }
        return department;
    }
    
    @Override
    @Transactional
    public void addDepartment(Department department) {
        int rows = departmentMapper.insert(department);
        if (rows == 0) {
            throw new BusinessException("新增部门失败");
        }
    }
    
    @Override
    @Transactional
    public void updateDepartment(Integer deptId, Department department) {
        department.setDeptId(deptId);
        int rows = departmentMapper.update(department);
        if (rows == 0) {
            throw new BusinessException("更新部门失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteDepartment(Integer deptId) {
        int rows = departmentMapper.delete(deptId);
        if (rows == 0) {
            throw new BusinessException("删除部门失败");
        }
    }
    
    @Override
    public List<DepartmentStatsVO> getDepartmentStats() {
        return departmentMapper.selectDepartmentStats();
    }
    
    @Override
    public BigDecimal getDepartmentAvgSalary(Integer deptId) {
        return departmentMapper.selectAvgSalary(deptId);
    }
}

