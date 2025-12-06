package com.epms.entity;

import lombok.Data;
import java.time.LocalDate;

/**
 * 员工实体类
 * 对应表：employee
 */
@Data
public class Employee {
    
    private Integer empId;              // 员工工号
    private Integer deptId;             // 所属部门
    private Integer posId;              // 当前职位
    private String name;                // 姓名
    private String gender;              // 性别
    private String idCard;              // 身份证号
    private String phone;               // 电话
    private String politicsStatus;      // 政治面貌
    private String hukouType;           // 户口状况
    private LocalDate hireDate;         // 入职日期
    private String status;              // 状态（试用期/在职/离职）
}

