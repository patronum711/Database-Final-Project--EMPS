package com.epms.mapper;

import com.epms.entity.Contract;
import com.epms.vo.ContractExpiringVO;
import com.epms.vo.ContractVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 合同Mapper接口
 */
@Mapper
public interface ContractMapper {
    
    // ========== 基础CRUD ==========
    
    List<ContractVO> selectAll();
    
    ContractVO selectById(@Param("contractId") Integer contractId);
    
    List<ContractVO> selectByEmployeeId(@Param("empId") Integer empId);
    
    int insert(Contract contract);
    
    int update(Contract contract);
    
    int delete(@Param("contractId") Integer contractId);
    
    // ========== 视图查询 ==========
    
    /**
     * 查询即将到期的合同（使用视图 v_contract_expiring_soon）
     */
    List<ContractExpiringVO> selectExpiringContracts();
}

