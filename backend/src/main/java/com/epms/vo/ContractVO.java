package com.epms.vo;

import lombok.Data;
import java.time.LocalDate;

/**
 * 合同视图对象
 */
@Data
public class ContractVO {
    
    private Integer contractId;
    private Integer empId;
    private String empName;         // 员工姓名
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}

