package com.epms.controller;

import com.epms.common.Result;
import com.epms.entity.Position;
import com.epms.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 职位控制器
 */
@RestController
@RequestMapping("/positions")
@RequiredArgsConstructor
public class PositionController {
    
    private final PositionService positionService;
    
    @GetMapping
    public Result<List<Position>> getAllPositions() {
        List<Position> positions = positionService.getAllPositions();
        return Result.success(positions);
    }
    
    @GetMapping("/{id}")
    public Result<Position> getPositionById(@PathVariable("id") Integer posId) {
        Position position = positionService.getPositionById(posId);
        return Result.success(position);
    }
    
    @PostMapping
    public Result<Void> addPosition(@RequestBody Position position) {
        positionService.addPosition(position);
        return Result.success("新增职位成功", null);
    }
    
    @PutMapping("/{id}")
    public Result<Void> updatePosition(@PathVariable("id") Integer posId, @RequestBody Position position) {
        positionService.updatePosition(posId, position);
        return Result.success("更新职位成功", null);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deletePosition(@PathVariable("id") Integer posId) {
        positionService.deletePosition(posId);
        return Result.success("删除职位成功", null);
    }
}

