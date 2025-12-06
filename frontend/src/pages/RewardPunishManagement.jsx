import { useState, useEffect } from 'react';
import { rewardPunishAPI, employeeAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function RewardPunishManagement() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    type: '奖励',
    amount: '',
    event_date: '',
    reason: '',
  });

  const loadData = async () => {
    try {
      const [recordData, empData] = await Promise.all([
        rewardPunishAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setRecords(recordData || []);
      setEmployees(empData || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({
      emp_id: '',
      type: '奖励',
      amount: '',
      event_date: '',
      reason: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      emp_id: record.emp_id || '',
      type: record.type || '奖励',
      amount: record.amount || '',
      event_date: record.event_date || '',
      reason: record.reason || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    if (!confirm('确定要删除该记录吗？')) return;
    try {
      await rewardPunishAPI.delete(record.rp_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empId = parseInt(formData.emp_id);
      const amount = parseFloat(formData.amount);
      
      if (isNaN(empId) || isNaN(amount)) {
        alert('请填写有效的员工和金额');
        return;
      }
      
      const data = {
        ...formData,
        emp_id: empId,
        amount: amount,
      };
      if (editingRecord) {
        await rewardPunishAPI.update(editingRecord.rp_id, data);
      } else {
        await rewardPunishAPI.create(data);
      }
      alert(editingRecord ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingRecord ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'rp_id', title: '记录编号', width: '100px' },
    {
      key: 'emp_name',
      title: '员工姓名',
      width: '120px',
      render: (_, row) => row.emp_name || '-',
    },
    {
      key: 'type',
      title: '类型',
      width: '80px',
      render: (type) => {
        const color = type === '奖励' ? 'success' : 'danger';
        return <span className={`status-badge ${color}`}>{type}</span>;
      },
    },
    {
      key: 'amount',
      title: '金额',
      width: '120px',
      render: (amount) => {
        const value = parseFloat(amount || 0);
        const color = value >= 0 ? '#27ae60' : '#e74c3c';
        return <span style={{ color }}>¥{value.toFixed(2)}</span>;
      },
    },
    { key: 'event_date', title: '日期', width: '120px' },
    { key: 'reason', title: '原因', width: '300px' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>奖惩管理</h2>
        <button className="btn-add" onClick={handleAdd}>
          + 新增记录
        </button>
      </div>

      <Table columns={columns} data={records} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? '编辑奖惩记录' : '新增奖惩记录'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">员工</label>
            <select
              className="form-select"
              value={formData.emp_id}
              onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })}
              required
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.name} (工号: {emp.emp_id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">类型</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="奖励">奖励</option>
                <option value="惩罚">惩罚</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">金额</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="奖励为正数，惩罚为负数"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label required">日期</label>
            <input
              type="date"
              className="form-input"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">原因</label>
            <textarea
              className="form-textarea"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="请输入奖惩原因"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingRecord ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

