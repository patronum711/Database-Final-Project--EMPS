package com.epms.dto;

import lombok.Data;

/**
 * 员工转正结果DTO
 * 用于存储过程 sp_employee_confirmation 的输出
 */
@Data
public class EmployeeConfirmationDTO {
    
    private Integer empId;          // 员工ID（用于输入）
    private String result;          // 存储过程返回的结果消息（用于输出）
    private Boolean success;        // 是否成功
    
    public EmployeeConfirmationDTO() {}
    
    public EmployeeConfirmationDTO(String result) {
        this.result = result;
        this.success = result != null && result.contains("成功");
    }
}

