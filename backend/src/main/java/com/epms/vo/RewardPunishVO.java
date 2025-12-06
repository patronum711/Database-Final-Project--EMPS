package com.epms.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 奖惩视图对象
 */
@Data
public class RewardPunishVO {
    
    private Integer rpId;
    private Integer empId;
    private String empName;         // 员工姓名
    private String type;
    private BigDecimal amount;
    private LocalDate eventDate;
    private String reason;
}

