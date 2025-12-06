package com.epms.service;

import com.epms.entity.Position;

import java.util.List;

/**
 * 职位服务接口
 */
public interface PositionService {
    
    List<Position> getAllPositions();
    
    Position getPositionById(Integer posId);
    
    void addPosition(Position position);
    
    void updatePosition(Integer posId, Position position);
    
    void deletePosition(Integer posId);
}

