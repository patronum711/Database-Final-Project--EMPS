package com.epms.vo;

import lombok.Data;
import java.time.LocalDate;

/**
 * 员工视图对象
 * 用于返回给前端的员工信息（含关联信息）
 */
@Data
public class EmployeeVO {
    
    private Integer empId;              //员工工号
    private Integer deptId;             // 部门ID
    private String deptName;            // 部门名称
    private Integer posId;              // 职位ID
    private String posName;             // 职位名称
    private String name;                // 姓名
    private String gender;              // 性别
    private String idCard;              // 身份证号
    private String safeIdCard;          // 脱敏身份证号
    private String phone;               // 电话
    private String politicsStatus;      // 政治面貌
    private String hukouType;           // 户口状况
    private LocalDate hireDate;         // 入职日期
    private String status;              // 状态
}

