# 快速开始指南

本指南帮助您快速部署和体验增强后的员工人事管理系统（EPMS）。

---

## 📋 前置要求

- MySQL 8.0+ （支持CHECK约束和事件调度器）
- Node.js 16+ 和 npm
- （可选）Java 17+ 和 Maven（如需运行后端）

---

## 🚀 快速部署

### 步骤 1：部署数据库

```bash
# 1. 登录 MySQL
mysql -u root -p

# 2. 执行建表脚本
mysql> source /path/to/my-app/database/Query_1.sql

# 3. 验证创建成功
mysql> USE epms_final_db;
mysql> SHOW TABLES;
mysql> SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';
mysql> SHOW PROCEDURE STATUS WHERE Db = 'epms_final_db';
mysql> SHOW FUNCTION STATUS WHERE Db = 'epms_final_db';
mysql> SHOW TRIGGERS;
mysql> SHOW EVENTS;

# 4. 启用事件调度器（重要！）
mysql> SET GLOBAL event_scheduler = ON;
```

**预期结果**：
- 11 个数据表
- 5 个视图
- 3 个函数
- 5 个存储过程
- 6 个触发器
- 2 个事件

---

### 步骤 2：启动前端（演示模式）

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖（首次运行）
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
# 打开 http://localhost:5173
```

**演示模式登录**：
- 点击"演示模式登录"按钮
- 无需后端即可体验前端功能
- 数据为模拟数据

---

### 步骤 3：（可选）启动后端

```bash
# 1. 进入后端目录
cd backend

# 2. 启动 Spring Boot
mvn spring-boot:run

# 3. 验证后端
# 访问 http://localhost:8080/api/auth/health
```

详细的后端启动指南请参考：[backend/README.md](../backend/README.md)

---

## 🎯 功能体验指南

### 1. Dashboard - 系统概览

**体验内容**：
- ✅ 查看基础统计卡片（员工、部门、职位、合同预警）
- ✅ 查看部门统计分析（使用视图 `v_dept_employee_stats`）
  - 每个部门的人数、在职/试用期人数
  - 部门平均工资
- ✅ 查看合同到期预警（使用视图 `v_contract_expiring_soon`）
  - 按紧急程度分级（红/黄/蓝）
  - 显示剩余天数

**数据库功能标识**：
- 蓝色徽章：标注使用的视图名称

---

### 2. 员工管理

**体验内容**：

#### 2.1 查看员工列表
- HR 角色：身份证号自动脱敏（使用视图 `v_emp_safe_profile`）
- ADMIN 角色：显示完整信息

#### 2.2 查看员工详情
点击"查看详情"按钮，查看：
- ✅ **工龄**：X年X个月（使用函数 `fn_calc_work_years`）
- ✅ **员工级别**：新员工/初级/中级/高级/资深（使用函数 `fn_get_employee_grade`）
- ✅ **合同信息**：合同数量、当前合同到期日
- ✅ **培训情况**：已完成/总数
- ✅ **考勤统计**：近30天考勤天数
- ✅ **敏感信息**：ADMIN可见完整信息，HR看到脱敏信息

**数据库功能标识**：
- 紫色标签：标注使用的函数名称
- 蓝色徽章：标注使用的视图名称

#### 2.3 员工转正
- 试用期员工显示绿色"转正"按钮
- 点击后调用存储过程 `sp_employee_confirmation`
- 存储过程自动判断：
  - ✅ 是否为试用期状态
  - ✅ 工龄是否满足条件（≥1个月）
  - ✅ 自动更新状态为"在职"
  - ✅ 触发器自动记录"转正"变动到人事变动表
- 显示详细结果消息

**测试步骤**：
1. 新增一个试用期员工（入职日期设为1个月前）
2. 在列表中找到该员工，点击"转正"按钮
3. 确认转正
4. 查看结果消息
5. 进入"人事变动管理"查看自动生成的转正记录

---

### 3. 考勤管理

**体验内容**：

#### 3.1 批量考勤录入
- 点击紫色"📋 批量录入"按钮
- 选择部门、日期、考勤类型
- 调用存储过程 `sp_batch_attendance`
- 自动为该部门所有在职员工录入考勤
- 显示影响的记录数

**数据库功能**：
- 存储过程自动排除已有考勤记录的员工
- 根据考勤类型自动设置工时（正常8h，请假0h等）

**测试步骤**：
1. 确保某个部门有多个在职员工
2. 点击"批量录入"
3. 选择该部门和今天的日期
4. 选择"正常"类型
5. 提交后查看影响的记录数
6. 在考勤列表中验证记录

---

### 4. 合同管理

**体验内容**：
- 查看合同列表
- 新增合同时，触发器 `trg_contract_date_check` 自动验证日期
- 如果结束日期已过期，自动设为"过期"状态
- 事件调度器 `evt_update_expired_contracts` 每天自动更新过期合同

**测试步骤**：
1. 新增一个合同，结束日期设为昨天
2. 提交后查看状态是否自动变为"过期"

---

### 5. 培训管理

**体验内容**：
- 为员工分配培训课程
- 录入培训成绩
- 触发器 `trg_training_auto_complete` 自动判断：
  - 成绩 ≥ 60 分：自动标记为"已完成"
  - 成绩 < 60 分：保持"未完成"

**测试步骤**：
1. 创建培训课程
2. 为员工分配培训
3. 录入成绩（如：85分）
4. 查看完成状态是否自动变为"已完成"

---

### 6. 人事变动管理

**体验内容**：
- 查看所有人事变动记录
- 这些记录由触发器自动生成：
  - ✅ 新增员工 → 自动记录"入职"
  - ✅ 员工转正 → 自动记录"转正"
  - ✅ 员工离职 → 自动记录"离职"
  - ✅ 部门调整 → 自动记录"调动"
  - ✅ 职位变更 → 自动记录"晋升"

**测试步骤**：
1. 新增一个员工
2. 进入人事变动管理，查看"入职"记录
3. 将该员工转正
4. 再次查看，应该有"转正"记录
5. 修改该员工的部门
6. 查看是否有"调动"记录

---

## 🔍 数据库功能验证

### 在 MySQL 中直接测试

```sql
USE epms_final_db;

-- 1. 测试视图
SELECT * FROM v_dept_employee_stats;
SELECT * FROM v_contract_expiring_soon;
SELECT * FROM v_employee_comprehensive LIMIT 5;

-- 2. 测试函数
SELECT fn_calc_work_years(1) AS work_years;
SELECT fn_get_employee_grade(1) AS grade;
SELECT fn_dept_avg_salary(1) AS avg_salary;

-- 3. 测试存储过程 - 员工转正
CALL sp_employee_confirmation(1, @result);
SELECT @result;

-- 4. 测试存储过程 - 批量考勤
CALL sp_batch_attendance(1, '2024-12-06', '正常', @rows);
SELECT @rows AS affected_rows;

-- 5. 测试存储过程 - 考勤汇总
CALL sp_dept_attendance_summary(1, '2024-12');

-- 6. 测试存储过程 - 绩效评估
CALL sp_employee_performance(1, '2024-12');

-- 7. 查看触发器效果
-- 插入员工后查看 job_change 表
INSERT INTO employee (name, dept_id, pos_id, gender, id_card, hire_date, status)
VALUES ('测试员工', 1, 1, '男', '110101199001011234', CURDATE(), '试用期');
SELECT * FROM job_change WHERE emp_id = LAST_INSERT_ID();

-- 8. 查看事件状态
SHOW EVENTS;
SELECT * FROM information_schema.EVENTS WHERE EVENT_SCHEMA = 'epms_final_db';

-- 9. 查看月度考勤汇总表
SELECT * FROM attendance_monthly_summary;

-- 10. 查看工资调整历史
SELECT * FROM salary_adjustment_log;
```

---

## 📊 数据库功能清单

| 功能 | 数量 | 验证方法 |
|-----|------|---------|
| 视图 | 5 | `SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW'` |
| 函数 | 3 | `SHOW FUNCTION STATUS WHERE Db = 'epms_final_db'` |
| 存储过程 | 5 | `SHOW PROCEDURE STATUS WHERE Db = 'epms_final_db'` |
| 触发器 | 6 | `SHOW TRIGGERS` |
| 事件 | 2 | `SHOW EVENTS` |

---

## 🐛 常见问题

### 1. 事件调度器未启动

**症状**：合同状态不会自动更新，月度汇总不会自动生成

**解决**：
```sql
SET GLOBAL event_scheduler = ON;
```

### 2. 视图查询报错

**症状**：`SELECT * FROM v_xxx` 报错

**解决**：
- 检查数据库脚本是否完整执行
- 检查相关表是否存在数据

### 3. 存储过程调用失败

**症状**：`CALL sp_xxx` 报错

**解决**：
- 检查参数类型是否正确
- 检查是否有必要的数据（如员工、部门等）

### 4. 前端显示空数据

**症状**：Dashboard 没有显示部门统计

**解决**：
- 确保数据库中有数据
- 检查后端API是否正确实现
- 或使用"演示模式"查看UI效果

---

## 📚 相关文档

- **`CHANGES.md`** - 详细变更说明
- **`DATABASE_IMPLEMENTATION_SUMMARY.md`** - 实施总结
- **`frontend/DATABASE_FEATURES_USAGE.md`** - 数据库功能使用说明
- **`database/ENHANCEMENT_SUGGESTIONS.md`** - 功能增强建议

---

## ✅ 验收检查清单

### 数据库层
- [ ] 所有表创建成功（11个）
- [ ] 所有视图创建成功（5个）
- [ ] 所有函数创建成功（3个）
- [ ] 所有存储过程创建成功（5个）
- [ ] 所有触发器创建成功（6个）
- [ ] 所有事件创建成功（2个）
- [ ] 事件调度器已启用

### 前端层
- [ ] Dashboard 显示部门统计
- [ ] Dashboard 显示合同预警
- [ ] 员工详情显示工龄和级别
- [ ] 员工详情显示综合信息
- [ ] 试用期员工显示转正按钮
- [ ] 转正功能正常工作
- [ ] 批量考勤录入功能正常

### 功能测试
- [ ] 新增员工自动记录入职变动
- [ ] 员工转正自动记录转正变动
- [ ] 培训成绩≥60自动标记完成
- [ ] 合同日期验证正常
- [ ] 批量考勤录入成功

---

## 🎓 学习建议

1. **先理解数据库功能**：阅读 SQL 脚本，理解每个视图、函数、存储过程的作用
2. **在数据库中测试**：直接在 MySQL 中调用函数和存储过程，观察结果
3. **观察触发器效果**：执行 INSERT/UPDATE 操作，查看相关表的变化
4. **体验前端功能**：在前端界面中使用这些功能，理解前后端如何协作
5. **阅读代码**：查看前端如何调用 API，后端如何调用数据库功能

---

**祝您使用愉快！如有问题，请参考相关文档或提Issue。**

---

**创建日期**：2024-12-06  
**版本**：v1.0

