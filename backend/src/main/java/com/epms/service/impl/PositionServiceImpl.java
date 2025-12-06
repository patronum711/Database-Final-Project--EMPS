package com.epms.service.impl;

import com.epms.entity.Position;
import com.epms.exception.BusinessException;
import com.epms.mapper.PositionMapper;
import com.epms.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 职位服务实现类
 */
@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    
    private final PositionMapper positionMapper;
    
    @Override
    public List<Position> getAllPositions() {
        return positionMapper.selectAll();
    }
    
    @Override
    public Position getPositionById(Integer posId) {
        Position position = positionMapper.selectById(posId);
        if (position == null) {
            throw new BusinessException("职位不存在");
        }
        return position;
    }
    
    @Override
    @Transactional
    public void addPosition(Position position) {
        int rows = positionMapper.insert(position);
        if (rows == 0) {
            throw new BusinessException("新增职位失败");
        }
    }
    
    @Override
    @Transactional
    public void updatePosition(Integer posId, Position position) {
        position.setPosId(posId);
        int rows = positionMapper.update(position);
        if (rows == 0) {
            throw new BusinessException("更新职位失败");
        }
    }
    
    @Override
    @Transactional
    public void deletePosition(Integer posId) {
        int rows = positionMapper.delete(posId);
        if (rows == 0) {
            throw new BusinessException("删除职位失败");
        }
    }
}

