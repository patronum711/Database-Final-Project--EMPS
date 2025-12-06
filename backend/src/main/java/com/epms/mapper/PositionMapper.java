package com.epms.mapper;

import com.epms.entity.Position;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 职位Mapper接口
 */
@Mapper
public interface PositionMapper {
    
    List<Position> selectAll();
    
    Position selectById(@Param("posId") Integer posId);
    
    int insert(Position position);
    
    int update(Position position);
    
    int delete(@Param("posId") Integer posId);
}

