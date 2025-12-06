package com.epms.mapper;

import com.epms.entity.RewardPunish;
import com.epms.vo.RewardPunishVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 奖惩Mapper接口
 */
@Mapper
public interface RewardPunishMapper {
    
    List<RewardPunishVO> selectAll();
    
    RewardPunishVO selectById(@Param("rpId") Integer rpId);
    
    List<RewardPunishVO> selectByEmployeeId(@Param("empId") Integer empId);
    
    int insert(RewardPunish rewardPunish);
    
    int update(RewardPunish rewardPunish);
    
    int delete(@Param("rpId") Integer rpId);
}

