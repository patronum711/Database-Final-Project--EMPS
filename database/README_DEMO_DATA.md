# 演示数据脚本说明

## 文件说明

- `demo_data.sql` - 完整的演示数据SQL脚本
- `Query_1.sql` - 数据库结构定义脚本（需先执行）

## 使用方法

### 1. 执行顺序

```bash
# 第一步：创建数据库结构（如果还没有执行过）
mysql -u root -p < database/Query_1.sql

# 第二步：插入演示数据
mysql -u root -p < database/demo_data.sql
```

### 2. 或者在MySQL客户端中执行

```sql
-- 1. 先执行数据库结构脚本
SOURCE database/Query_1.sql;

-- 2. 再执行演示数据脚本
SOURCE database/demo_data.sql;
```

## 数据规模

### 基础数据
- **部门**: 5个（技术部、销售部、人事部、财务部、市场部）
- **职位**: 12个（覆盖所有部门，包含不同职级）
- **员工**: 15名（覆盖所有状态：在职、试用期）

### 业务数据
- **合同**: 18份（覆盖所有类型：固定期限、无固定期限、实习；所有状态：有效、过期）
- **考勤**: 约150条记录（覆盖所有类型：正常、迟到、早退、旷工、请假、出差；包含最近2个月数据）
- **奖惩**: 18条记录（奖励和惩罚各半）
- **培训课程**: 5门课程
- **培训记录**: 20条记录（包含已完成和未完成）
- **人事变动**: 4条历史记录（大部分由触发器自动生成）
- **系统用户**: 3个（admin、hr001、hr002）

## 数据特点

### 1. 全面性
- ✅ 覆盖所有表
- ✅ 覆盖所有枚举类型（状态、类型等）
- ✅ 覆盖所有业务场景

### 2. 真实性
- ✅ 合理的日期范围（2018-2025）
- ✅ 合理的关联关系
- ✅ 符合业务逻辑的数据

### 3. 可测试性
- ✅ 包含过期合同（用于测试合同预警视图）
- ✅ 包含异常考勤（用于测试考勤统计）
- ✅ 包含不同状态的培训记录（用于测试触发器）
- ✅ 包含不同状态的员工（用于测试各种功能）

## 数据验证

执行脚本后，会自动输出数据统计信息，包括：
- 各部门员工数量
- 各状态员工数量
- 合同、考勤、奖惩等记录数量

## 测试建议

### 1. 视图测试
```sql
-- 员工安全视图（身份证脱敏）
SELECT * FROM v_emp_safe_profile LIMIT 5;

-- 部门统计视图
SELECT * FROM v_dept_employee_stats;

-- 合同预警视图
SELECT * FROM v_contract_expiring_soon;

-- 月度考勤统计
SELECT * FROM v_attendance_monthly_stats WHERE month = '2024-12';

-- 员工综合信息
SELECT * FROM v_employee_comprehensive LIMIT 5;
```

### 2. 函数测试
```sql
-- 计算工龄
SELECT emp_id, name, fn_calc_work_years(emp_id) AS work_years 
FROM employee LIMIT 5;

-- 获取员工级别
SELECT emp_id, name, fn_get_employee_grade(emp_id) AS grade 
FROM employee LIMIT 5;

-- 部门平均工资
SELECT dept_id, dept_name, fn_dept_avg_salary(dept_id) AS avg_salary 
FROM department;
```

### 3. 存储过程测试
```sql
-- 员工转正
CALL sp_employee_confirmation(3, @result); 
SELECT @result;

-- 月度工资计算
CALL sp_calc_monthly_salary('2024-12');

-- 部门考勤汇总
CALL sp_dept_attendance_summary(1, '2024-12');

-- 员工绩效评估
CALL sp_employee_performance(1, '2024-12');
```

### 4. 触发器测试
```sql
-- 测试入职触发器：插入新员工会自动记录到job_change
INSERT INTO employee (dept_id, pos_id, name, gender, id_card, phone, hire_date, status) 
VALUES (1, 1, '测试员工', '男', '110101200001011111', '13800000000', CURDATE(), '试用期');

-- 查看是否自动生成了入职记录
SELECT * FROM job_change WHERE emp_id = LAST_INSERT_ID();

-- 测试转正触发器：更新员工状态为在职会自动记录
UPDATE employee SET status = '在职' WHERE emp_id = LAST_INSERT_ID();

-- 查看是否自动生成了转正记录
SELECT * FROM job_change WHERE emp_id = LAST_INSERT_ID() ORDER BY change_date DESC LIMIT 1;
```

## 注意事项

1. **执行前备份**：如果数据库中已有数据，建议先备份
2. **外键约束**：脚本会自动处理外键检查，确保数据完整性
3. **触发器**：大部分人事变动记录会由触发器自动生成，无需手动插入
4. **日期范围**：考勤数据主要集中在2024年11-12月，可根据需要调整
5. **清空数据**：如需重新生成，可取消注释脚本开头的TRUNCATE语句

## 数据重置

如果需要清空所有数据重新生成：

```sql
-- 注意：这会删除所有数据，谨慎使用！
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE emp_training_relation;
TRUNCATE TABLE attendance;
TRUNCATE TABLE reward_punish;
TRUNCATE TABLE job_change;
TRUNCATE TABLE contract;
TRUNCATE TABLE training_course;
TRUNCATE TABLE employee;
TRUNCATE TABLE position;
TRUNCATE TABLE department;
TRUNCATE TABLE sys_user;
SET FOREIGN_KEY_CHECKS = 1;

-- 然后重新执行 demo_data.sql
```

## 登录信息

演示数据包含以下系统用户：

- **管理员**: 
  - 用户名: `admin`
  - 密码: `admin123`
  - 角色: ADMIN

- **人事专员**: 
  - 用户名: `hr001`
  - 密码: `hr123`
  - 角色: HR
  - 关联员工: 李十一 (emp_id: 10)

- **人事专员2**: 
  - 用户名: `hr002`
  - 密码: `hr123`
  - 角色: HR
  - 关联员工: 张十二 (emp_id: 11)

