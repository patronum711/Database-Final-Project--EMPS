package com.epms.service.impl;

import com.epms.entity.Contract;
import com.epms.exception.BusinessException;
import com.epms.mapper.ContractMapper;
import com.epms.service.ContractService;
import com.epms.vo.ContractExpiringVO;
import com.epms.vo.ContractVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 合同服务实现类
 */
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    
    private final ContractMapper contractMapper;
    
    @Override
    public List<ContractVO> getAllContracts() {
        return contractMapper.selectAll();
    }
    
    @Override
    public ContractVO getContractById(Integer contractId) {
        ContractVO contract = contractMapper.selectById(contractId);
        if (contract == null) {
            throw new BusinessException("合同不存在");
        }
        return contract;
    }
    
    @Override
    @Transactional
    public void addContract(Contract contract) {
        int rows = contractMapper.insert(contract);
        if (rows == 0) {
            throw new BusinessException("新增合同失败");
        }
    }
    
    @Override
    @Transactional
    public void updateContract(Integer contractId, Contract contract) {
        contract.setContractId(contractId);
        int rows = contractMapper.update(contract);
        if (rows == 0) {
            throw new BusinessException("更新合同失败");
        }
    }
    
    @Override
    @Transactional
    public void deleteContract(Integer contractId) {
        int rows = contractMapper.delete(contractId);
        if (rows == 0) {
            throw new BusinessException("删除合同失败");
        }
    }
    
    @Override
    public List<ContractExpiringVO> getExpiringContracts() {
        return contractMapper.selectExpiringContracts();
    }
}

