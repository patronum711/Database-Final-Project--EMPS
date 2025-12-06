package com.epms.controller;

import com.epms.common.Result;
import com.epms.entity.Contract;
import com.epms.service.ContractService;
import com.epms.vo.ContractExpiringVO;
import com.epms.vo.ContractVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 合同控制器
 */
@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class ContractController {
    
    private final ContractService contractService;
    
    /**
     * 查询所有合同
     */
    @GetMapping
    public Result<List<ContractVO>> getAllContracts() {
        List<ContractVO> contracts = contractService.getAllContracts();
        return Result.success(contracts);
    }
    
    /**
     * 根据ID查询合同
     */
    @GetMapping("/{id}")
    public Result<ContractVO> getContractById(@PathVariable("id") Integer contractId) {
        ContractVO contract = contractService.getContractById(contractId);
        return Result.success(contract);
    }
    
    /**
     * 新增合同
     */
    @PostMapping
    public Result<Void> addContract(@RequestBody Contract contract) {
        contractService.addContract(contract);
        return Result.success("新增合同成功", null);
    }
    
    /**
     * 更新合同
     */
    @PutMapping("/{id}")
    public Result<Void> updateContract(@PathVariable("id") Integer contractId, @RequestBody Contract contract) {
        contractService.updateContract(contractId, contract);
        return Result.success("更新合同成功", null);
    }
    
    /**
     * 删除合同
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteContract(@PathVariable("id") Integer contractId) {
        contractService.deleteContract(contractId);
        return Result.success("删除合同成功", null);
    }
    
    // ========== 数据库功能接口 ==========
    
    /**
     * 查询即将到期合同（使用视图 v_contract_expiring_soon）
     */
    @GetMapping("/expiring-view")
    public Result<List<ContractExpiringVO>> getExpiringContracts() {
        List<ContractExpiringVO> contracts = contractService.getExpiringContracts();
        return Result.success(contracts);
    }
    
    /**
     * 查询即将到期合同（兼容旧接口）
     */
    @GetMapping("/expiring")
    public Result<List<ContractExpiringVO>> getExpiring(@RequestParam(value = "days", defaultValue = "30") Integer days) {
        // 使用视图查询，忽略days参数（视图已固定30天）
        List<ContractExpiringVO> contracts = contractService.getExpiringContracts();
        return Result.success(contracts);
    }
}

