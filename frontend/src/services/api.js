import axios from 'axios';

// 配置axios基础URL（根据实际后端地址修改）
const API_BASE_URL = 'http://localhost:8080/api';

// 工具函数：将下划线命名转换为驼峰命名（用于发送请求）
function toCamelCase(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const camelObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 将下划线命名转换为驼峰命名
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        camelObj[camelKey] = toCamelCase(obj[key]);
      }
    }
    return camelObj;
  }
  
  return obj;
}

// 工具函数：将驼峰命名转换为下划线命名（用于接收响应）
function toSnakeCase(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const snakeObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 将驼峰命名转换为下划线命名
        // 例如：deptId -> dept_id, empId -> emp_id
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        snakeObj[snakeKey] = toSnakeCase(obj[key]);
      }
    }
    return snakeObj;
  }
  
  return obj;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token并转换字段名
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 对于POST、PUT、PATCH请求，将请求体中的下划线命名转换为驼峰命名
    if (config.data && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
      config.data = toCamelCase(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    // 后端返回的是 Result 对象，格式：{ code, message, data }
    // 自动提取 data 字段返回
    const result = response.data;
    if (result && typeof result === 'object' && 'code' in result) {
      // 检查 code，如果不是 200，抛出错误
      if (result.code !== 200) {
        const error = new Error(result.message || '请求失败');
        error.response = { data: result };
        return Promise.reject(error);
      }
      // 如果是 Result 格式且成功
      // 如果 data 字段存在且不为 null，返回 data；否则返回整个 result（包含 message）
      if ('data' in result && result.data !== null && result.data !== undefined) {
        // 将返回的数据从驼峰命名转换为下划线命名（适配前端代码）
        return toSnakeCase(result.data);
      }
      // 对于 POST/PUT/DELETE 操作，data 可能为 null，返回成功标识
      return { success: true, message: result.message };
    }
    // 否则直接返回（兼容其他格式），也进行转换
    return toSnakeCase(result);
  },
  (error) => {
    // 演示模式：如果后端不可用，返回空数据而不是抛出错误
    const isDemoMode = localStorage.getItem('demo-mode') === 'true';
    if (isDemoMode && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNREFUSED')) {
      // 根据请求类型返回合适的空数据
      const url = error.config?.url || '';
      const method = error.config?.method?.toLowerCase() || '';
      
      // GET请求且是列表接口，返回空数组
      if (method === 'get') {
        const listEndpoints = [
          '/departments', '/positions', '/employees', '/contracts', 
          '/attendances', '/reward-punish', '/training/courses', 
          '/training/records', '/job-changes'
        ];
        const isListEndpoint = listEndpoints.some(endpoint => url.includes(endpoint)) && 
                              !url.match(/\/(\d+)$/); // 不是单个资源查询
        
        if (isListEndpoint || url.includes('/getAll') || url.includes('/get')) {
          return Promise.resolve([]); // 返回空数组
        }
        return Promise.resolve({}); // 其他GET请求返回空对象
      }
      
      // POST/PUT/DELETE请求在演示模式下也返回成功响应
      if (method === 'post' || method === 'put') {
        return Promise.resolve({ success: true, message: '演示模式：操作已模拟' });
      }
      if (method === 'delete') {
        return Promise.resolve({ success: true });
      }
      
      return Promise.resolve({}); // 默认返回空对象
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('demo-mode');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== 认证相关 ====================
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/current'),
};

// ==================== 部门管理 ====================
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  getStats: () => api.get('/departments/stats'), // 使用视图 v_dept_employee_stats
  getAvgSalary: (deptId) => api.get(`/departments/${deptId}/avg-salary`), // 使用函数 fn_dept_avg_salary
};

// ==================== 职位管理 ====================
export const positionAPI = {
  getAll: () => api.get('/positions'),
  getById: (id) => api.get(`/positions/${id}`),
  create: (data) => api.post('/positions', data),
  update: (id, data) => api.put(`/positions/${id}`, data),
  delete: (id) => api.delete(`/positions/${id}`),
};

// ==================== 员工管理 ====================
export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getSafeProfile: () => api.get('/employees/safe-profile'), // 使用视图 v_emp_safe_profile
  getComprehensive: () => api.get('/employees/comprehensive'), // 使用视图 v_employee_comprehensive
  confirmEmployee: (empId) => api.post(`/employees/${empId}/confirm`), // 调用存储过程 sp_employee_confirmation
  getPerformance: (empId, month) => api.get(`/employees/${empId}/performance`, { params: { month } }), // 调用存储过程 sp_employee_performance
};

// ==================== 合同管理 ====================
export const contractAPI = {
  getAll: (params) => api.get('/contracts', { params }),
  getById: (id) => api.get(`/contracts/${id}`),
  getByEmployeeId: (empId) => api.get(`/contracts/employee/${empId}`),
  create: (data) => api.post('/contracts', data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
  getExpiringSoon: (days = 30) => api.get(`/contracts/expiring?days=${days}`),
  getExpiringView: () => api.get('/contracts/expiring-view'), // 使用视图 v_contract_expiring_soon
};

// ==================== 考勤管理 ====================
export const attendanceAPI = {
  getAll: (params) => api.get('/attendances', { params }),
  getById: (id) => api.get(`/attendances/${id}`),
  getByEmployeeId: (empId, params) => api.get(`/attendances/employee/${empId}`, { params }),
  create: (data) => api.post('/attendances', data),
  update: (id, data) => api.put(`/attendances/${id}`, data),
  delete: (id) => api.delete(`/attendances/${id}`),
  getStatistics: (empId, month) => api.get(`/attendances/statistics/${empId}`, { params: { month } }),
  getMonthlyStats: (month) => api.get('/attendances/monthly-stats', { params: { month } }), // 使用视图 v_attendance_monthly_stats
  batchCreate: (deptId, workDate, type) => api.post('/attendances/batch', { deptId, workDate, type }), // 调用存储过程 sp_batch_attendance
  getDeptSummary: (deptId, month) => api.get('/attendances/dept-summary', { params: { deptId, month } }), // 调用存储过程 sp_dept_attendance_summary
  getMonthlySummary: () => api.get('/attendances/monthly-summary'), // 查询汇总表
};

// ==================== 奖惩管理 ====================
export const rewardPunishAPI = {
  getAll: (params) => api.get('/reward-punish', { params }),
  getById: (id) => api.get(`/reward-punish/${id}`),
  getByEmployeeId: (empId, params) => api.get(`/reward-punish/employee/${empId}`, { params }),
  create: (data) => api.post('/reward-punish', data),
  update: (id, data) => api.put(`/reward-punish/${id}`, data),
  delete: (id) => api.delete(`/reward-punish/${id}`),
};

// ==================== 培训管理 ====================
export const trainingAPI = {
  // 课程管理
  getAllCourses: () => api.get('/training/courses'),
  getCourseById: (id) => api.get(`/training/courses/${id}`),
  createCourse: (data) => api.post('/training/courses', data),
  updateCourse: (id, data) => api.put(`/training/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/training/courses/${id}`),
  
  // 培训记录
  getTrainingRecords: (params) => api.get('/training/records', { params }),
  enrollEmployee: (data) => api.post('/training/enroll', data),
  updateTrainingRecord: (empId, courseId, data) => api.put(`/training/records/${empId}/${courseId}`, data),
  deleteTrainingRecord: (empId, courseId) => api.delete(`/training/records/${empId}/${courseId}`),
  getEmployeeTrainings: (empId) => api.get(`/training/employee/${empId}`),
};

// ==================== 人事变动 ====================
export const jobChangeAPI = {
  getAll: (params) => api.get('/job-changes', { params }),
  getById: (id) => api.get(`/job-changes/${id}`),
  getByEmployeeId: (empId) => api.get(`/job-changes/employee/${empId}`),
};

// ==================== 工资计算 ====================
export const salaryAPI = {
  calculateMonthlySalary: (month) => api.get(`/salary/calculate`, { params: { month } }),
  getEmployeeSalary: (empId, month) => api.get(`/salary/employee/${empId}`, { params: { month } }),
};

export default api;

