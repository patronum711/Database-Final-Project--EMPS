import { useState, useEffect } from 'react';
import { salaryAPI } from '../services/api';
import Table from '../components/Table';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function SalaryManagement() {
  const [salaries, setSalaries] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [monthOptions, setMonthOptions] = useState([]);

  // 生成最近12个月的选项
  useEffect(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthValue = date.toISOString().slice(0, 7);
      const monthLabel = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`;
      options.push({ value: monthValue, label: monthLabel });
    }
    setMonthOptions(options);
  }, []);

  const handleCalculate = async () => {
    if (!month) {
      alert('请选择月份');
      return;
    }
    setLoading(true);
    try {
      const data = await salaryAPI.calculateMonthlySalary(month);
      setSalaries(data || []);
    } catch (error) {
      console.error('计算工资失败:', error);
      alert('计算工资失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'emp_id', title: '工号', width: '80px' },
    { key: 'name', title: '姓名', width: '100px' },
    {
      key: '基本工资',
      title: '基本工资',
      width: '120px',
      render: (value) => `¥${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      key: '奖惩绩效',
      title: '奖惩绩效',
      width: '120px',
      render: (value) => {
        const val = parseFloat(value || 0);
        const color = val >= 0 ? '#27ae60' : '#e74c3c';
        return <span style={{ color }}>¥{val.toFixed(2)}</span>;
      },
    },
    {
      key: '考勤扣款',
      title: '考勤扣款',
      width: '120px',
      render: (value) => `¥${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      key: '实发工资',
      title: '实发工资',
      width: '120px',
      render: (value) => {
        const val = parseFloat(value || 0);
        return <strong style={{ color: '#2c3e50' }}>¥{val.toFixed(2)}</strong>;
      },
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>工资计算</h2>
      </div>

      <div
        className="filter-section"
        style={{
          marginBottom: '20px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label required">选择月份</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-primary"
            onClick={handleCalculate}
            disabled={loading}
            style={{ height: '38px' }}
          >
            {loading ? '计算中...' : '计算工资'}
          </button>
        </div>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#6c757d' }}>
          说明：计算公式：实发工资 = 基本工资 + 奖惩绩效 - 考勤扣款（迟到一次扣50元）
        </p>
      </div>

      <Table
        columns={columns}
        data={salaries}
        emptyMessage="请选择月份并点击计算按钮"
      />
    </div>
  );
}

