# EPMS 后端服务

员工人事管理系统（Employee Personnel Management System）后端服务

---

## 📋 技术栈

- **Spring Boot** 3.2.0
- **MyBatis** 3.0.3
- **MySQL** 8.0+
- **Maven** 3.x
- **JWT** 认证
- **Lombok** 简化代码

---

## 🚀 快速启动

### 1. 环境准备

确保已安装：
- JDK 17+
- Maven 3.x
- MySQL 8.0+

### 2. 数据库配置

#### 方式1：使用默认配置
默认连接配置（application.yml）：
- URL: `jdbc:mysql://localhost:3306/epms_final_db`
- 用户名: `root`
- 密码: `root`

#### 方式2：自定义配置
通过环境变量设置：
```bash
export DB_PASSWORD=your_password
export JWT_SECRET=your_secret_key
```

### 3. 初始化数据库

```bash
# 1. 登录 MySQL
mysql -u root -p

# 2. 执行建表脚本
mysql> source /path/to/database/Query_1.sql

# 3. 插入演示数据
mysql> source /path/to/database/demo_data.sql

# 4. 启用事件调度器（重要！）
mysql> SET GLOBAL event_scheduler = ON;
```

### 4. 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

或使用 IDE（如 IntelliJ IDEA）直接运行 `EpmsApplication.java`

看到以下输出表示启动成功：
```
========================================
EPMS Backend Started Successfully!
API Base URL: http://localhost:8080/api
========================================
```

### 5. 验证服务

```bash
# 健康检查
curl http://localhost:8080/api/auth/health

# 登录测试
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📡 API 接口

### 基础路径
```
http://localhost:8080/api
```

### 主要接口

#### 认证接口
- `POST /auth/login` - 用户登录
- `GET /auth/current` - 获取当前用户信息
- `GET /auth/health` - 健康检查

#### 员工管理
- `GET /employees` - 查询所有员工
- `GET /employees/{id}` - 查询员工详情
- `POST /employees` - 新增员工
- `PUT /employees/{id}` - 更新员工
- `DELETE /employees/{id}` - 删除员工
- `GET /employees/safe-profile` - 查询安全视图（使用 v_emp_safe_profile）
- `GET /employees/comprehensive` - 查询综合信息（使用 v_employee_comprehensive）
- `POST /employees/{id}/confirm` - 员工转正（调用 sp_employee_confirmation）
- `GET /employees/{id}/performance?month=2024-12` - 查询员工绩效（调用 sp_employee_performance）

#### 部门管理
- `GET /departments` - 查询所有部门
- `GET /departments/{id}` - 查询部门详情
- `POST /departments` - 新增部门
- `PUT /departments/{id}` - 更新部门
- `DELETE /departments/{id}` - 删除部门
- `GET /departments/stats` - 查询部门统计（使用 v_dept_employee_stats）
- `GET /departments/{id}/avg-salary` - 查询部门平均工资（调用 fn_dept_avg_salary）

#### 考勤管理
- `GET /attendances` - 查询所有考勤记录
- `POST /attendances` - 新增考勤记录
- `PUT /attendances/{id}` - 更新考勤记录
- `DELETE /attendances/{id}` - 删除考勤记录
- `GET /attendances/monthly-stats?month=2024-12` - 月度统计（使用 v_attendance_monthly_stats）
- `POST /attendances/batch` - 批量录入（调用 sp_batch_attendance）
- `GET /attendances/dept-summary?deptId=1&month=2024-12` - 部门汇总（调用 sp_dept_attendance_summary）

#### 合同管理
- `GET /contracts` - 查询所有合同
- `POST /contracts` - 新增合同
- `PUT /contracts/{id}` - 更新合同
- `DELETE /contracts/{id}` - 删除合同
- `GET /contracts/expiring-view` - 查询即将到期合同（使用 v_contract_expiring_soon）

#### 其他模块
- 职位管理、奖惩管理、培训管理、人事变动、工资计算

---

## 🗂️ 项目结构

```
backend/
├── src/main/java/com/epms/
│   ├── common/          # 通用类（Result）
│   ├── config/          # 配置类（CORS等）
│   ├── controller/      # 控制器层（10个）
│   ├── dto/             # 数据传输对象（5个）
│   ├── entity/          # 实体类（10个）
│   ├── exception/       # 异常处理
│   ├── mapper/          # MyBatis Mapper接口（10个）
│   ├── service/         # 服务层接口
│   │   └── impl/        # 服务层实现（10个）
│   ├── util/            # 工具类（JWT等）
│   ├── vo/              # 视图对象（10个）
│   └── EpmsApplication.java  # 启动类
├── src/main/resources/
│   ├── mapper/          # MyBatis XML映射文件（10个）
│   └── application.yml  # 配置文件
└── pom.xml              # Maven配置
```

---

## 🎯 数据库功能应用

### 视图（Views）- 5个
- `v_emp_safe_profile` - 员工安全视图（身份证脱敏）
- `v_dept_employee_stats` - 部门统计视图
- `v_contract_expiring_soon` - 合同预警视图
- `v_attendance_monthly_stats` - 月度考勤统计视图
- `v_employee_comprehensive` - 员工综合信息视图

### 函数（Functions）- 3个
- `fn_calc_work_years(emp_id)` - 计算工龄
- `fn_get_employee_grade(emp_id)` - 获取员工级别
- `fn_dept_avg_salary(dept_id)` - 部门平均工资

### 存储过程（Procedures）- 5个
- `sp_employee_confirmation` - 员工转正
- `sp_batch_attendance` - 批量考勤录入
- `sp_dept_attendance_summary` - 部门考勤汇总
- `sp_employee_performance` - 员工绩效评估
- `sp_calc_monthly_salary` - 月度工资计算

---

## 🔧 配置说明

### application.yml 核心配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/epms_final_db
    username: root
    password: ${DB_PASSWORD:root}

server:
  port: 8080
  servlet:
    context-path: /api

app:
  jwt:
    secret: ${JWT_SECRET:epms-secret-key-for-jwt-token-generation-2024}
    expiration: 86400000  # 24小时
  cors:
    allowed-origins: http://localhost:5173,http://localhost:3000
```

---

## 📝 开发指南

### 添加新模块的步骤

1. **创建 Entity** - `src/main/java/com/epms/entity/`
2. **创建 VO/DTO** - `src/main/java/com/epms/vo/` 或 `dto/`
3. **创建 Mapper 接口** - `src/main/java/com/epms/mapper/`
4. **创建 Mapper XML** - `src/main/resources/mapper/`
5. **创建 Service 接口** - `src/main/java/com/epms/service/`
6. **创建 Service 实现** - `src/main/java/com/epms/service/impl/`
7. **创建 Controller** - `src/main/java/com/epms/controller/`

### 调用存储过程示例

**Mapper 接口**：
```java
void callEmployeeConfirmation(@Param("dto") EmployeeConfirmationDTO dto);
```

**Mapper XML**：
```xml
<select id="callEmployeeConfirmation" statementType="CALLABLE">
    {CALL sp_employee_confirmation(
        #{dto.empId, mode=IN, jdbcType=INTEGER}, 
        #{dto.result, mode=OUT, jdbcType=VARCHAR}
    )}
</select>
```

**Service 调用**：
```java
EmployeeConfirmationDTO dto = new EmployeeConfirmationDTO();
dto.setEmpId(empId);
employeeMapper.callEmployeeConfirmation(dto);
String result = dto.getResult();
```

---

## 🧪 API测试示例

### 登录并获取Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 查询员工（使用Token）

```bash
curl http://localhost:8080/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 员工转正（存储过程）

```bash
curl -X POST http://localhost:8080/api/employees/3/confirm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 批量考勤录入（存储过程）

```bash
curl -X POST http://localhost:8080/api/attendances/batch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deptId":1,"workDate":"2024-12-06","type":"正常"}'
```

---

## ⚠️ 注意事项

1. **数据库版本**：需要 MySQL 8.0+ 以支持数据库高级功能
2. **事件调度器**：确保 MySQL 的事件调度器已启用
   ```sql
   SET GLOBAL event_scheduler = ON;
   ```
3. **跨域配置**：默认允许 `localhost:5173`，如需修改请编辑 `application.yml`
4. **密码加密**：当前为演示版本，密码未加密，生产环境请使用 BCrypt 加密
5. **JWT密钥**：生产环境请使用环境变量设置强密钥

---

## 🐛 常见问题

### 1. 启动失败 - 数据库连接错误
- 检查MySQL服务是否启动
- 检查数据库名称：`epms_final_db`
- 检查用户名密码是否正确
- 检查端口：3306

### 2. 登录返回401
- 验证测试用户是否存在：`SELECT * FROM sys_user;`
- 如果不存在，执行演示数据脚本：`source /path/to/database/demo_data.sql`

### 3. 跨域错误
- 检查 `application.yml` 中的 CORS 配置是否包含前端地址

### 4. 存储过程调用失败
- 检查存储过程是否创建成功：`SHOW PROCEDURE STATUS WHERE Db = 'epms_final_db';`
- 检查参数类型是否正确

---

## ✅ 开发状态

- [x] 基础框架搭建
- [x] 认证模块（登录、获取当前用户）
- [x] 员工管理（CRUD + 视图 + 存储过程）
- [x] 部门管理（CRUD + 视图 + 函数）
- [x] 考勤管理（CRUD + 视图 + 存储过程）
- [x] 合同管理（CRUD + 视图）
- [x] 职位管理（CRUD）
- [x] 奖惩管理（CRUD）
- [x] 培训管理（CRUD）
- [x] 人事变动管理（查询）
- [x] 工资管理（存储过程）

---

**创建日期**：2024-12-06  
**版本**：v1.0  
**状态**：✅ 核心功能已完成，可运行
