package com.epms.service.impl;

import com.epms.entity.RewardPunish;
import com.epms.exception.BusinessException;
import com.epms.mapper.RewardPunishMapper;
import com.epms.service.RewardPunishService;
import com.epms.vo.RewardPunishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 奖惩服务实现类
 */
@Service
@RequiredArgsConstructor
public class RewardPunishServiceImpl implements RewardPunishService {
    
    private final RewardPunishMapper rewardPunishMapper;
    
    @Override
    public List<RewardPunishVO> getAllRewardPunish() {
        return rewardPunishMapper.selectAll();
    }
    
    @Override
    public RewardPunishVO getRewardPunishById(Integer rpId) {
        RewardPunishVO rewardPunish = rewardPunishMapper.selectById(rpId);
        if (rewardPunish == null) {
            throw new BusinessException("奖惩记录不存在");
        }
        return rewardPunish;
    }
    
    @Override
    public List<RewardPunishVO> getRewardPunishByEmployeeId(Integer empId) {
        return rewardPunishMapper.selectByEmployeeId(empId);
    }
    
    @Override
    @Transactional
    public void addRewardPunish(RewardPunish rewardPunish) {
        int rows = rewardPunishMapper.insert(rewardPunish);
        if (rows == 0) {
            throw new BusinessException("新增奖惩记录失败");
        }
    }
    
    @Override
    @Transactional
    public void updateRewardPunish(Integer rpId, RewardPunish rewardPunish) {
        rewardPunish.setRpId(rpId);
        int rows = rewardPunishMapper.update(rewardPunish);
        if (rows == 0) {
            throw new BusinessException("更新奖惩记录失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteRewardPunish(Integer rpId) {
        int rows = rewardPunishMapper.delete(rpId);
        if (rows == 0) {
            throw new BusinessException("删除奖惩记录失败");
        }
    }
}

