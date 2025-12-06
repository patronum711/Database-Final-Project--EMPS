package com.epms.controller;

import com.epms.common.Result;
import com.epms.entity.RewardPunish;
import com.epms.service.RewardPunishService;
import com.epms.vo.RewardPunishVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 奖惩控制器
 */
@RestController
@RequestMapping("/reward-punish")
@RequiredArgsConstructor
public class RewardPunishController {
    
    private final RewardPunishService rewardPunishService;
    
    /**
     * 查询所有奖惩记录
     */
    @GetMapping
    public Result<List<RewardPunishVO>> getAllRewardPunish() {
        List<RewardPunishVO> records = rewardPunishService.getAllRewardPunish();
        return Result.success(records);
    }
    
    /**
     * 根据ID查询奖惩记录
     */
    @GetMapping("/{id}")
    public Result<RewardPunishVO> getRewardPunishById(@PathVariable("id") Integer rpId) {
        RewardPunishVO record = rewardPunishService.getRewardPunishById(rpId);
        return Result.success(record);
    }
    
    /**
     * 根据员工ID查询奖惩记录
     */
    @GetMapping("/employee/{empId}")
    public Result<List<RewardPunishVO>> getRewardPunishByEmployeeId(@PathVariable("empId") Integer empId) {
        List<RewardPunishVO> records = rewardPunishService.getRewardPunishByEmployeeId(empId);
        return Result.success(records);
    }
    
    /**
     * 新增奖惩记录
     */
    @PostMapping
    public Result<Void> addRewardPunish(@RequestBody RewardPunish rewardPunish) {
        rewardPunishService.addRewardPunish(rewardPunish);
        return Result.success("新增奖惩记录成功", null);
    }
    
    /**
     * 更新奖惩记录
     */
    @PutMapping("/{id}")
    public Result<Void> updateRewardPunish(@PathVariable("id") Integer rpId, @RequestBody RewardPunish rewardPunish) {
        rewardPunishService.updateRewardPunish(rpId, rewardPunish);
        return Result.success("更新奖惩记录成功", null);
    }
    
    /**
     * 删除奖惩记录
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteRewardPunish(@PathVariable("id") Integer rpId) {
        rewardPunishService.deleteRewardPunish(rpId);
        return Result.success("删除奖惩记录成功", null);
    }
}

