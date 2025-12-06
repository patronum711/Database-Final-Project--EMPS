package com.epms.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 奖惩实体类
 * 对应表：reward_punish
 */
@Data
public class RewardPunish {
    
    private Integer rpId;           // 奖惩编号
    private Integer empId;          // 员工工号
    private String type;            // 类型（奖励/惩罚）
    private BigDecimal amount;      // 金额
    private LocalDate eventDate;    // 事件日期
    private String reason;          // 原因
}

