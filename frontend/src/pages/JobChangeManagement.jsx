import { useState, useEffect } from 'react';
import { jobChangeAPI } from '../services/api';
import Table from '../components/Table';
import './EmployeeManagement.css';

export default function JobChangeManagement() {
  const [jobChanges, setJobChanges] = useState([]);
  const [filter, setFilter] = useState({ emp_id: '', change_type: '' });

  const loadData = async () => {
    try {
      // 构建查询参数，将下划线命名转换为驼峰命名
      const params = {};
      if (filter.emp_id) {
        params.empId = parseInt(filter.emp_id);
      }
      if (filter.change_type) {
        params.changeType = filter.change_type;
      }
      const data = await jobChangeAPI.getAll(params);
      setJobChanges(data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    loadData();
  };

  const columns = [
    { key: 'change_id', title: '记录编号', width: '100px' },
    {
      key: 'emp_name',
      title: '员工姓名',
      width: '120px',
      render: (_, row) => row.emp_name || '-',
    },
    {
      key: 'change_type',
      title: '变动类型',
      width: '100px',
      render: (type) => {
        const typeMap = {
          入职: 'success',
          转正: 'success',
          调动: 'warning',
          晋升: 'success',
          离职: 'danger',
        };
        return (
          <span className={`status-badge ${typeMap[type] || ''}`}>{type}</span>
        );
      },
    },
    { key: 'old_dept_name', title: '原部门', width: '120px' },
    { key: 'new_dept_name', title: '新部门', width: '120px' },
    { key: 'old_pos_name', title: '原职位', width: '120px' },
    { key: 'new_pos_name', title: '新职位', width: '120px' },
    {
      key: 'change_date',
      title: '变动时间',
      width: '160px',
      render: (date) => (date ? new Date(date).toLocaleString('zh-CN') : '-'),
    },
    { key: 'remarks', title: '备注', width: '200px' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>人事变动记录</h2>
      </div>

      <div className="filter-section" style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '6px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">员工工号</label>
            <input
              type="text"
              className="form-input"
              value={filter.emp_id}
              onChange={(e) => setFilter({ ...filter, emp_id: e.target.value })}
              placeholder="输入员工工号"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">变动类型</label>
            <select
              className="form-select"
              value={filter.change_type}
              onChange={(e) => setFilter({ ...filter, change_type: e.target.value })}
            >
              <option value="">全部</option>
              <option value="入职">入职</option>
              <option value="转正">转正</option>
              <option value="调动">调动</option>
              <option value="晋升">晋升</option>
              <option value="离职">离职</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleFilter}>
            查询
          </button>
        </div>
      </div>

      <Table columns={columns} data={jobChanges} emptyMessage="暂无人事变动记录" />
    </div>
  );
}

