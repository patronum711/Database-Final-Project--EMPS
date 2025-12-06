import { useEffect, useState } from 'react';
import { employeeAPI, departmentAPI, positionAPI, contractAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPositions: 0,
    expiringContracts: 0,
  });
  const [deptStats, setDeptStats] = useState([]);
  const [expiringContracts, setExpiringContracts] = useState([]);

  const loadStatistics = async () => {
    try {
      const [employees, departments, positions, contracts, deptStatsData, expiringView] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        positionAPI.getAll(),
        contractAPI.getExpiringSoon(30),
        departmentAPI.getStats(), // 使用视图 v_dept_employee_stats
        contractAPI.getExpiringView(), // 使用视图 v_contract_expiring_soon
      ]);
      setStats({
        totalEmployees: employees?.length || 0,
        totalDepartments: departments?.length || 0,
        totalPositions: positions?.length || 0,
        expiringContracts: contracts?.length || 0,
      });
      setDeptStats(deptStatsData || []);
      setExpiringContracts(expiringView || []);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return (
    <div className="dashboard">
      <h2>系统概览</h2>
      
      {/* 基础统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEmployees}</div>
            <div className="stat-label">员工总数</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDepartments}</div>
            <div className="stat-label">部门数量</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPositions}</div>
            <div className="stat-label">职位数量</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.expiringContracts}</div>
            <div className="stat-label">即将到期合同</div>
          </div>
        </div>
      </div>

      {/* 部门统计（使用视图 v_dept_employee_stats） */}
      {deptStats.length > 0 && (
        <div className="dashboard-section">
          <h3>部门统计分析</h3>
          <div className="dept-stats-grid">
            {deptStats.map((dept) => (
              <div key={dept.dept_id} className="dept-stat-card">
                <div className="dept-stat-header">
                  <h4>{dept.dept_name}</h4>
                  <span className="dept-location">{dept.location || '-'}</span>
                </div>
                <div className="dept-stat-body">
                  <div className="stat-row">
                    <span className="label">总人数：</span>
                    <span className="value">{dept.total_employees || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">在职：</span>
                    <span className="value success">{dept.active_employees || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">试用期：</span>
                    <span className="value warning">{dept.probation_employees || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">平均工资：</span>
                    <span className="value">¥{parseFloat(dept.avg_dept_salary || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 合同预警（使用视图 v_contract_expiring_soon） */}
      {expiringContracts.length > 0 && (
        <div className="dashboard-section">
          <h3>合同到期预警</h3>
          <div className="alert-list">
            {expiringContracts.slice(0, 5).map((contract) => (
              <div 
                key={contract.contract_id} 
                className={`alert-item ${
                  contract.alert_level === '紧急' ? 'alert-danger' : 
                  contract.alert_level === '重要' ? 'alert-warning' : 'alert-info'
                }`}
              >
                <div className="alert-icon">
                  {contract.alert_level === '紧急' ? '🔴' : contract.alert_level === '重要' ? '🟡' : '🟢'}
                </div>
                <div className="alert-content">
                  <div className="alert-title">
                    {contract.emp_name} - {contract.dept_name || '-'}
                  </div>
                  <div className="alert-desc">
                    合同类型：{contract.contract_type} | 到期日期：{contract.end_date} | 
                    剩余 <strong>{contract.days_remaining}</strong> 天
                  </div>
                </div>
                <div className="alert-badge">{contract.alert_level}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
