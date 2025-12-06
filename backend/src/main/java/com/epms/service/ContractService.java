package com.epms.service;

import com.epms.entity.Contract;
import com.epms.vo.ContractExpiringVO;
import com.epms.vo.ContractVO;

import java.util.List;

/**
 * 合同服务接口
 */
public interface ContractService {
    
    /**
     * 查询所有合同
     */
    List<ContractVO> getAllContracts();
    
    /**
     * 根据ID查询合同
     */
    ContractVO getContractById(Integer contractId);
    
    /**
     * 新增合同
     */
    void addContract(Contract contract);
    
    /**
     * 更新合同
     */
    void updateContract(Integer contractId, Contract contract);
    
    /**
     * 删除合同
     */
    void deleteContract(Integer contractId);
    
    /**
     * 查询即将到期合同（使用视图 v_contract_expiring_soon）
     */
    List<ContractExpiringVO> getExpiringContracts();
}

