package com.epms.mapper;

import com.epms.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 系统用户Mapper接口
 */
@Mapper
public interface SysUserMapper {
    
    /**
     * 根据用户名查询
     */
    SysUser selectByUsername(@Param("username") String username);
    
    /**
     * 插入用户
     */
    int insert(SysUser sysUser);
    
    /**
     * 更新用户
     */
    int update(SysUser sysUser);
}

