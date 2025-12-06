# EPMS 前端应用

员工人事管理系统（Employee Personnel Management System）前端应用

---

## 📋 技术栈

- **React 18** - UI框架
- **Vite** - 构建工具和开发服务器
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **CSS3** - 样式设计

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

---

## 📁 项目结构

```
frontend/
├── src/
│   ├── pages/              # 页面组件（10个）
│   │   ├── Login.jsx       # 登录页
│   │   ├── Dashboard.jsx   # 首页/仪表盘
│   │   ├── EmployeeManagement.jsx    # 员工管理
│   │   ├── DepartmentManagement.jsx  # 部门管理
│   │   ├── PositionManagement.jsx    # 职位管理
│   │   ├── ContractManagement.jsx    # 合同管理
│   │   ├── AttendanceManagement.jsx  # 考勤管理
│   │   ├── RewardPunishManagement.jsx # 奖惩管理
│   │   ├── TrainingManagement.jsx    # 培训管理
│   │   ├── JobChangeManagement.jsx   # 人事变动
│   │   └── SalaryManagement.jsx      # 工资计算
│   │
│   ├── components/         # 通用组件
│   │   ├── Layout.jsx      # 布局组件（侧边栏+顶部栏）
│   │   ├── Table.jsx       # 表格组件
│   │   ├── Modal.jsx       # 弹窗组件
│   │   └── Form.jsx        # 表单组件
│   │
│   ├── services/           # API服务
│   │   └── api.js          # Axios配置和API方法
│   │
│   ├── App.jsx             # 根组件（路由配置）
│   └── main.jsx            # 入口文件
│
├── public/                 # 静态资源
├── package.json            # 依赖配置
└── vite.config.js          # Vite配置
```

---

## 🔧 核心功能

### 1. API服务 (`src/services/api.js`)

**特性**：
- ✅ 自动添加JWT Token
- ✅ 自动字段名转换（下划线↔驼峰）
- ✅ 统一响应处理（提取Result.data）
- ✅ 错误处理（401自动跳转登录）
- ✅ 演示模式支持

**字段名转换**：
- 请求时：`dept_name` → `deptName`（发送给后端）
- 响应时：`deptName` → `dept_name`（返回给前端）

### 2. 布局组件 (`src/components/Layout.jsx`)

**特性**：
- ✅ 侧边栏导航（10个功能模块）
- ✅ 顶部栏（标题 + 用户信息 + 退出登录）
- ✅ 当前用户信息显示（用户名、角色）
- ✅ 角色中文映射（管理员/人事/员工）

### 3. 页面功能

#### Dashboard（首页）
- 基础统计卡片（员工、部门、职位、合同预警）
- 部门统计（使用视图 `v_dept_employee_stats`）
- 合同到期预警（使用视图 `v_contract_expiring_soon`）

#### 员工管理
- 员工列表（CRUD）
- 员工详情（工龄、级别、综合信息）
  - 工龄计算（使用函数 `fn_calc_work_years`）
  - 员工级别（使用函数 `fn_get_employee_grade`）
  - 综合信息（使用视图 `v_employee_comprehensive`）
- 员工转正（调用存储过程 `sp_employee_confirmation`）
- 身份证脱敏（HR角色使用视图 `v_emp_safe_profile`）

#### 考勤管理
- 考勤记录（CRUD）
- 批量考勤录入（调用存储过程 `sp_batch_attendance`）
- 月度考勤统计（使用视图 `v_attendance_monthly_stats`）
- 部门考勤汇总（调用存储过程 `sp_dept_attendance_summary`）

#### 其他模块
- 部门管理（CRUD + 视图 + 函数）
- 合同管理（CRUD + 视图）
- 职位管理、奖惩管理、培训管理、人事变动、工资计算

---

## 🎯 数据库功能应用

### 视图（Views）- 5个

| 视图 | 应用页面 | 功能说明 |
|-----|---------|---------|
| `v_emp_safe_profile` | 员工管理 | 身份证脱敏（HR角色） |
| `v_dept_employee_stats` | Dashboard | 部门统计（人数、工资） |
| `v_contract_expiring_soon` | Dashboard | 合同到期预警 |
| `v_attendance_monthly_stats` | 考勤管理 | 月度考勤统计 |
| `v_employee_comprehensive` | 员工详情 | 员工综合信息 |

### 函数（Functions）- 3个

| 函数 | 应用页面 | 功能说明 |
|-----|---------|---------|
| `fn_calc_work_years` | 员工详情 | 计算工龄 |
| `fn_get_employee_grade` | 员工详情 | 获取员工级别 |
| `fn_dept_avg_salary` | 部门管理 | 部门平均工资 |

### 存储过程（Procedures）- 5个

| 存储过程 | 应用页面 | 功能说明 |
|---------|---------|---------|
| `sp_employee_confirmation` | 员工管理 | 员工转正 |
| `sp_batch_attendance` | 考勤管理 | 批量考勤录入 |
| `sp_dept_attendance_summary` | 考勤管理 | 部门考勤汇总 |
| `sp_employee_performance` | 员工管理 | 员工绩效评估 |
| `sp_calc_monthly_salary` | 工资计算 | 月度工资计算 |

---

## 🎨 UI特性

### 数据库功能标识

- **蓝色徽章**：标识使用的视图（View）
- **紫色标签**：标识使用的函数（Function）
- **绿色按钮**：标识调用的存储过程（Procedure）

### 响应式设计

- 侧边栏固定宽度（240px）
- 主内容区域自适应
- 表格支持横向滚动

### 用户体验

- 加载状态提示
- 错误提示信息
- 操作成功提示
- 确认对话框

---

## 🔐 认证机制

### JWT Token

- Token存储在 `localStorage`
- 请求时自动添加到 `Authorization` 头
- Token过期自动跳转登录页

### 演示模式

- 无需后端即可体验前端功能
- 数据为模拟数据
- 点击"演示模式登录"按钮

---

## 📡 API配置

### 基础URL

默认配置：`http://localhost:8080/api`

修改位置：`src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 跨域配置

后端需要配置CORS，允许前端地址：
- `http://localhost:5173`（Vite默认）
- `http://localhost:3000`（可选）

---

## 🐛 常见问题

### 1. 字段名不匹配

**问题**：前端显示 `undefined`

**解决**：
- 前端已自动处理字段名转换
- 检查后端返回的数据格式
- 检查 `api.js` 中的转换函数

### 2. 登录失败

**问题**：提示"登录失败，请检查用户名和密码"

**解决**：
- 检查后端服务是否启动
- 检查API地址是否正确
- 使用"演示模式登录"测试前端

### 3. 空白页面

**问题**：登录后页面空白

**解决**：
- 检查浏览器控制台错误
- 检查API响应格式
- 检查路由配置

### 4. CORS错误

**问题**：跨域请求被阻止

**解决**：
- 检查后端CORS配置
- 确保前端地址在允许列表中

---

## ✅ 开发状态

- [x] 基础框架搭建
- [x] 路由配置
- [x] API服务封装
- [x] 用户认证
- [x] 所有页面组件（10个）
- [x] 数据库功能集成
- [x] 字段名自动转换
- [x] 用户界面优化

---

**创建日期**：2024-12-06  
**版本**：v1.0  
**状态**：✅ 核心功能已完成
