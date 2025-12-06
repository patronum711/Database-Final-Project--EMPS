# 员工人事管理系统 (EPMS)

> Employee Personnel Management System - 一个完整的全栈Web应用，充分展示数据库高级功能的应用

---

## 📖 项目简介

EPMS是一个**员工人事管理系统**，专为数据库课程设计，充分展示了数据库高级功能（视图、函数、存储过程、触发器、事件等）在实际项目中的应用。

### ✨ 核心特点

- ✅ **数据库驱动**：25+ 个数据库高级功能（视图、函数、存储过程、触发器、事件）
- ✅ **业务逻辑下沉**：将业务规则实现在数据库层，而非应用层
- ✅ **完整的CRUD**：涵盖员工、部门、职位、合同、考勤、奖惩、培训、人事变动等模块
- ✅ **前后端分离**：React 前端 + Spring Boot 后端 + MySQL 数据库
- ✅ **功能可视化**：前端UI清晰标识每个数据库功能的使用
- ✅ **现代化UI**：美观的用户界面，良好的用户体验

---

## 🏗️ 技术栈

### 前端
- **React 18** - UI框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Axios** - HTTP客户端

### 后端
- **Spring Boot 3.2.0** - Java框架
- **MyBatis 3.0.3** - ORM框架
- **JWT** - 身份认证
- **Maven** - 依赖管理

### 数据库
- **MySQL 8.0+** - 关系型数据库
- **视图（Views）** - 5个
- **自定义函数（Functions）** - 3个
- **存储过程（Procedures）** - 5个
- **触发器（Triggers）** - 6个
- **事件调度器（Events）** - 2个

---

## 🚀 快速开始

### 前置要求

- MySQL 8.0+
- Node.js 16+ 和 npm
- JDK 17+ 和 Maven（如需运行后端）

### 5分钟快速启动

#### 1. 初始化数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行建表脚本
mysql> source /path/to/database/Query_1.sql

# 插入演示数据
mysql> source /path/to/database/demo_data.sql

# 启用事件调度器
mysql> SET GLOBAL event_scheduler = ON;
```

#### 2. 启动后端（可选）

```bash
cd backend
mvn spring-boot:run
```

后端将运行在 `http://localhost:8080/api`

#### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端将运行在 `http://localhost:5173`

#### 4. 登录系统

- **用户名**: `admin`
- **密码**: `admin123`
- 或点击"演示模式登录"（无需后端）

---

## 📊 数据库功能统计

| 功能类型 | 数量 | 说明 |
|---------|------|------|
| **视图（View）** | 5 | 数据安全、统计分析、预警提示 |
| **自定义函数（Function）** | 3 | 工龄计算、员工级别、平均工资 |
| **存储过程（Procedure）** | 5 | 员工转正、批量操作、绩效评估 |
| **触发器（Trigger）** | 6 | 自动日志、状态更新、数据验证 |
| **事件调度器（Event）** | 2 | 定时任务、自动维护 |
| **约束（Constraint）** | 4 | 数据完整性、业务规则 |

**总计**：25个数据库高级功能

---

## 🎯 核心功能模块

### 1. 员工管理
- 员工档案CRUD
- 员工详情查看（工龄、级别、综合信息）
- 员工转正（存储过程 `sp_employee_confirmation`）
- 身份证脱敏（视图 `v_emp_safe_profile`）

### 2. 部门管理
- 部门CRUD
- 部门统计（视图 `v_dept_employee_stats`）
- 部门平均工资（函数 `fn_dept_avg_salary`）

### 3. 考勤管理
- 考勤记录CRUD
- 批量考勤录入（存储过程 `sp_batch_attendance`）
- 月度考勤统计（视图 `v_attendance_monthly_stats`）

### 4. 合同管理
- 合同CRUD
- 合同到期预警（视图 `v_contract_expiring_soon`）
- 自动状态更新（触发器、事件）

### 5. 培训管理
- 培训课程管理
- 培训记录管理
- 自动完成标记（触发器）

### 6. 其他模块
- 奖惩管理、人事变动、工资计算

---

## 🔐 测试账号

| 用户名 | 密码 | 角色 | 说明 |
|-------|------|------|------|
| admin | admin123 | ADMIN | 管理员（可查看所有敏感信息） |
| hr001 | hr123 | HR | HR用户（身份证脱敏） |
| hr002 | hr123 | HR | HR用户（身份证脱敏） |

---

## 📁 项目结构

```
my-app/
├── backend/                 # 后端服务
│   ├── src/main/java/      # Java源码
│   ├── src/main/resources/ # 配置文件
│   └── README.md           # 后端文档
│
├── frontend/               # 前端应用
│   ├── src/                # React源码
│   └── README.md          # 前端文档
│
├── database/               # 数据库脚本
│   ├── Query_1.sql        # 数据库结构
│   ├── demo_data.sql      # 演示数据
│   └── README_DEMO_DATA.md # 数据说明
│
├── QUICK_START.md         # 快速开始指南
└── README.md              # 本文档
```

---

## 📚 文档说明

### 核心文档（按阅读顺序）

1. **[README.md](./README.md)** - 本文档，项目概览
2. **[QUICK_START.md](./QUICK_START.md)** - 快速开始指南（详细步骤和功能体验）
3. **[backend/README.md](./backend/README.md)** - 后端开发文档（快速启动、API接口、开发指南）
4. **[frontend/README.md](./frontend/README.md)** - 前端开发文档（快速启动、核心功能、UI特性）
5. **[database/README_DEMO_DATA.md](./database/README_DEMO_DATA.md)** - 演示数据说明（数据规模、测试建议）

### 数据库功能

所有数据库功能的详细说明和SQL源码请查看：
- **[database/Query_1.sql](./database/Query_1.sql)** - 完整的数据库结构定义（包含所有视图、函数、存储过程、触发器、事件的SQL代码）

---

## 🐛 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 检查数据库名称：`epms_final_db`
- 检查用户名密码配置

### 2. 事件调度器未启动
```sql
SET GLOBAL event_scheduler = ON;
```

### 3. 前端字段名不匹配
- 前端已自动处理字段名转换（下划线↔驼峰）
- 无需手动修改

### 4. 登录失败
- 检查测试账号是否存在
- 检查后端服务是否启动
- 或使用"演示模式登录"

---

## ✅ 功能清单

### 已完成
- [x] 数据库结构设计（11个表）
- [x] 数据库高级功能（25个）
- [x] 后端API实现（10个模块）
- [x] 前端UI实现（10个页面）
- [x] 用户认证（JWT）
- [x] 演示数据脚本
- [x] 字段名自动转换
- [x] 用户界面优化

---

## 🎓 学习建议

1. **先理解数据库功能**：阅读 `database/Query_1.sql`，理解每个视图、函数、存储过程的作用
2. **在数据库中测试**：直接在MySQL中调用函数和存储过程，观察结果
3. **观察触发器效果**：执行INSERT/UPDATE操作，查看相关表的变化
4. **体验前端功能**：在前端界面中使用这些功能，理解前后端如何协作
5. **阅读代码**：查看前端如何调用API，后端如何调用数据库功能

---

## 📞 技术支持

如遇到问题，请：
1. 查看 [QUICK_START.md](./QUICK_START.md) 中的常见问题部分
2. 检查日志输出
3. 验证数据库脚本是否完整执行

---

**创建日期**：2024-12-06  
**版本**：v1.0  
**状态**：✅ 核心功能已完成，可正常运行

**祝您使用愉快！**
