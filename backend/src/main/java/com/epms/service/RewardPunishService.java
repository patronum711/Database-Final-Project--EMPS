package com.epms.service;

import com.epms.entity.RewardPunish;
import com.epms.vo.RewardPunishVO;

import java.util.List;

/**
 * 奖惩服务接口
 */
public interface RewardPunishService {
    
    /**
     * 查询所有奖惩记录
     */
    List<RewardPunishVO> getAllRewardPunish();
    
    /**
     * 根据ID查询奖惩记录
     */
    RewardPunishVO getRewardPunishById(Integer rpId);
    
    /**
     * 根据员工ID查询奖惩记录
     */
    List<RewardPunishVO> getRewardPunishByEmployeeId(Integer empId);
    
    /**
     * 新增奖惩记录
     */
    void addRewardPunish(RewardPunish rewardPunish);
    
    /**
     * 更新奖惩记录
     */
    void updateRewardPunish(Integer rpId, RewardPunish rewardPunish);
    
    /**
     * 删除奖惩记录
     */
    void deleteRewardPunish(Integer rpId);
}

