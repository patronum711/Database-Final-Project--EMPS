import { useState, useEffect } from 'react';
import { employeeAPI, departmentAPI, positionAPI, authAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('HR'); // 默认 HR，从后端获取
  const [comprehensiveData, setComprehensiveData] = useState([]); // 综合视图数据
  const [formData, setFormData] = useState({
    name: '',
    dept_id: '',
    pos_id: '',
    gender: '男',
    id_card: '',
    phone: '',
    politics_status: '',
    hukou_type: '',
    hire_date: '',
    status: '试用期',
  });

  const loadData = async () => {
    try {
      const [empData, deptData, posData, comprehensiveData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        positionAPI.getAll(),
        employeeAPI.getComprehensive(), // 使用视图 v_employee_comprehensive
      ]);
      setEmployees(empData || []);
      setDepartments(deptData || []);
      setPositions(posData || []);
      setComprehensiveData(comprehensiveData || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  // 使用安全视图加载员工数据（HR角色用，身份证脱敏）
  const loadSafeData = async () => {
    try {
      const [empData, deptData, posData, comprehensiveData] = await Promise.all([
        employeeAPI.getSafeProfile(), // 使用视图 v_emp_safe_profile
        departmentAPI.getAll(),
        positionAPI.getAll(),
        employeeAPI.getComprehensive(), // HR也需要加载综合视图数据
      ]);
      setEmployees(empData || []);
      setDepartments(deptData || []);
      setPositions(posData || []);
      setComprehensiveData(comprehensiveData || []); // 设置综合视图数据
    } catch (error) {
      console.error('加载数据失败:', error);
      // 如果视图不可用，降级使用普通查询
      loadData();
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      // 拦截器已自动提取 Result.data，所以 user 直接是用户信息对象
      const role = user?.role || 'HR';
      setCurrentUserRole(role);
      
      // 根据角色加载不同的数据
      // HR 使用安全视图（身份证脱敏），ADMIN 看完整数据
      if (role === 'HR') {
        loadSafeData(); // 使用视图 v_emp_safe_profile
      } else {
        loadData(); // ADMIN 使用完整数据
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // 演示模式：从 localStorage 获取或默认为 ADMIN
      const demoMode = localStorage.getItem('demo-mode');
      if (demoMode === 'true') {
        setCurrentUserRole('ADMIN'); // 演示模式默认给 ADMIN 权限
        loadData();
      } else {
        loadData();
      }
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      dept_id: '',
      pos_id: '',
      gender: '男',
      id_card: '',
      phone: '',
      politics_status: '',
      hukou_type: '',
      hire_date: '',
      status: '试用期',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      dept_id: employee.dept_id || '',
      pos_id: employee.pos_id || '',
      gender: employee.gender || '男',
      id_card: employee.id_card || '',
      phone: employee.phone || '',
      politics_status: employee.politics_status || '',
      hukou_type: employee.hukou_type || '',
      hire_date: employee.hire_date || '',
      status: employee.status || '试用期',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (employee) => {
    if (!confirm(`确定要删除员工 ${employee.name} 吗？`)) return;
    try {
      await employeeAPI.delete(employee.emp_id);
      alert('删除成功');
      // 根据角色重新加载数据
      if (currentUserRole === 'HR') {
        loadSafeData();
      } else {
        loadData();
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleViewDetail = async (employee) => {
    try {
      let fullData;
      
      // 根据角色获取不同的员工信息
      if (currentUserRole === 'HR') {
        // HR使用安全视图，不调用getById（避免获取完整身份证）
        // 直接使用列表中的数据（已经是脱敏的）
        fullData = employee;
      } else {
        // ADMIN获取完整员工信息
        fullData = await employeeAPI.getById(employee.emp_id);
      }
      
      // 从综合视图获取额外信息（工龄、合同、培训等）
      const comprehensive = comprehensiveData.find(e => e.emp_id === employee.emp_id);
      
      setViewingEmployee({
        ...fullData,
        ...comprehensive,
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('加载员工详情失败:', error);
      alert('加载员工详情失败');
    }
  };

  // 员工转正功能（调用存储过程 sp_employee_confirmation）
  const handleConfirmEmployee = async (empId, empName) => {
    if (!window.confirm(`确认将员工 ${empName} 转正吗？`)) {
      return;
    }
    
    try {
      const result = await employeeAPI.confirmEmployee(empId);
      alert(result.message || result.p_result || '转正成功');
      // 根据角色重新加载数据
      if (currentUserRole === 'HR') {
        loadSafeData();
      } else {
        loadData();
      }
    } catch (error) {
      console.error('员工转正失败:', error);
      alert('员工转正失败：' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        dept_id: formData.dept_id ? parseInt(formData.dept_id) : null,
        pos_id: formData.pos_id ? parseInt(formData.pos_id) : null,
      };
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.emp_id, data);
      } else {
        await employeeAPI.create(data);
      }
      alert(editingEmployee ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      // 根据角色重新加载数据
      if (currentUserRole === 'HR') {
        loadSafeData();
      } else {
        loadData();
      }
    } catch (error) {
      alert(editingEmployee ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'emp_id', title: '工号', width: '80px' },
    { key: 'name', title: '姓名', width: '100px' },
    {
      key: 'dept_name',
      title: '部门',
      width: '120px',
      render: (_, row) => row.dept_name || '-',
    },
    {
      key: 'pos_name',
      title: '职位',
      width: '120px',
      render: (_, row) => row.pos_name || '-',
    },
    { key: 'gender', title: '性别', width: '60px' },
    { key: 'phone', title: '电话', width: '120px' },
    { key: 'hire_date', title: '入职日期', width: '120px' },
    {
      key: 'status',
      title: '状态',
      width: '80px',
      render: (status) => {
        const statusMap = { 试用期: 'warning', 在职: 'success', 离职: 'danger' };
        return <span className={`status-badge ${statusMap[status] || ''}`}>{status}</span>;
      },
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>员工管理</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUserRole === 'HR' && (
            <span className="view-mode-badge">
              🔒 安全视图模式（身份证已脱敏）
            </span>
          )}
        <button className="btn-add" onClick={handleAdd}>
          + 新增员工
        </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.title}
                </th>
              ))}
              <th style={{ width: '280px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-cell">
                  暂无数据
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.emp_id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(employee[col.key], employee) : employee[col.key]}
                    </td>
                  ))}
                  <td className="action-cell">
                    <button className="btn-view" onClick={() => handleViewDetail(employee)}>
                      详情
                    </button>
                    {employee.status === '试用期' ? (
                      <button 
                        className="btn-confirm" 
                        onClick={() => handleConfirmEmployee(employee.emp_id, employee.name)}
                      >
                        转正
                      </button>
                    ) : (
                      <button className="btn-confirm-disabled" disabled>
                        转正
                      </button>
                    )}
                    <button className="btn-edit" onClick={() => handleEdit(employee)}>
                      编辑
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(employee)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? '编辑员工' : '新增员工'}
        width="700px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">姓名</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">性别</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">身份证号</label>
              <input
                type="text"
                className="form-input"
                value={formData.id_card}
                onChange={(e) => setFormData({ ...formData, id_card: e.target.value })}
                required
                maxLength={18}
              />
            </div>
            <div className="form-group">
              <label className="form-label">电话</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">部门</label>
              <select
                className="form-select"
                value={formData.dept_id}
                onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
              >
                <option value="">请选择</option>
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">职位</label>
              <select
                className="form-select"
                value={formData.pos_id}
                onChange={(e) => setFormData({ ...formData, pos_id: e.target.value })}
              >
                <option value="">请选择</option>
                {positions.map((pos) => (
                  <option key={pos.pos_id} value={pos.pos_id}>
                    {pos.pos_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">政治面貌</label>
              <input
                type="text"
                className="form-input"
                value={formData.politics_status}
                onChange={(e) => setFormData({ ...formData, politics_status: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">户口状况</label>
              <input
                type="text"
                className="form-input"
                value={formData.hukou_type}
                onChange={(e) => setFormData({ ...formData, hukou_type: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">入职日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">状态</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="试用期">试用期</option>
                <option value="在职">在职</option>
                <option value="离职">离职</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingEmployee ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 员工详情模态框 */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="员工详细信息"
        width="700px"
      >
        {viewingEmployee && (
          <div className="employee-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">工号：</span>
                  <span className="detail-value">{viewingEmployee.emp_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">姓名：</span>
                  <span className="detail-value">{viewingEmployee.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">性别：</span>
                  <span className="detail-value">{viewingEmployee.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">电话：</span>
                  <span className="detail-value">{viewingEmployee.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">工龄：</span>
                  <span className="detail-value highlight">
                    {viewingEmployee.work_years || 0} 年 {viewingEmployee.work_months || 0} 个月
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">员工级别：</span>
                  <span className="detail-value highlight">
                    {viewingEmployee.work_years >= 10 ? '资深' : 
                     viewingEmployee.work_years >= 5 ? '高级' : 
                     viewingEmployee.work_years >= 3 ? '中级' : 
                     viewingEmployee.work_years >= 1 ? '初级' : '新员工'}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>
                敏感信息 
                {currentUserRole === 'ADMIN' ? (
                  <span className="admin-only-badge">ADMIN 完整信息</span>
                ) : (
                  <span className="hr-view-badge">HR 安全视图（脱敏）</span>
                )}
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">身份证号：</span>
                  <span className="detail-value">
                    {currentUserRole === 'ADMIN' 
                      ? (viewingEmployee.id_card || '-')
                      : (viewingEmployee.safe_id_card || viewingEmployee.id_card || '-')
                    }
                  </span>
                </div>
                {currentUserRole === 'ADMIN' && (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">政治面貌：</span>
                      <span className="detail-value">{viewingEmployee.politics_status || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">户口状况：</span>
                      <span className="detail-value">{viewingEmployee.hukou_type || '-'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>工作信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">部门：</span>
                  <span className="detail-value">{viewingEmployee.dept_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">职位：</span>
                  <span className="detail-value">{viewingEmployee.pos_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">职级：</span>
                  <span className="detail-value">{viewingEmployee.level || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">基本工资：</span>
                  <span className="detail-value">¥{parseFloat(viewingEmployee.base_salary || 0).toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">入职日期：</span>
                  <span className="detail-value">{viewingEmployee.hire_date || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">状态：</span>
                  <span className="detail-value">
                    <span className={`status-badge ${
                      viewingEmployee.status === '试用期' ? 'warning' : 
                      viewingEmployee.status === '在职' ? 'success' : 'danger'
                    }`}>
                      {viewingEmployee.status}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">合同数量：</span>
                  <span className="detail-value">{viewingEmployee.contract_count || 0} 份</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">当前合同到期：</span>
                  <span className="detail-value">{viewingEmployee.current_contract_end || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">培训完成：</span>
                  <span className="detail-value">
                    {viewingEmployee.completed_training_count || 0} / {viewingEmployee.training_count || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">近30天考勤：</span>
                  <span className="detail-value">{viewingEmployee.recent_attendance_count || 0} 天</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

