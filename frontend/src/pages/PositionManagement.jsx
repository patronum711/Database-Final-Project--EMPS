import { useState, useEffect } from 'react';
import { positionAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function PositionManagement() {
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [formData, setFormData] = useState({ pos_name: '', base_salary: '', level: '' });

  const loadData = async () => {
    try {
      const data = await positionAPI.getAll();
      setPositions(data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingPos(null);
    setFormData({ pos_name: '', base_salary: '', level: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (pos) => {
    setEditingPos(pos);
    setFormData({
      pos_name: pos.pos_name || '',
      base_salary: pos.base_salary || '',
      level: pos.level || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (pos) => {
    if (!confirm(`确定要删除职位 ${pos.pos_name} 吗？`)) return;
    try {
      await positionAPI.delete(pos.pos_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        base_salary: formData.base_salary ? parseFloat(formData.base_salary) : 0,
      };
      if (editingPos) {
        await positionAPI.update(editingPos.pos_id, data);
      } else {
        await positionAPI.create(data);
      }
      alert(editingPos ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingPos ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'pos_id', title: '职位编号', width: '100px' },
    { key: 'pos_name', title: '职位名称', width: '200px' },
    {
      key: 'base_salary',
      title: '基本工资',
      width: '120px',
      render: (salary) => `¥${parseFloat(salary || 0).toFixed(2)}`,
    },
    { key: 'level', title: '职级', width: '120px' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>职位管理</h2>
        <button className="btn-add" onClick={handleAdd}>
          + 新增职位
        </button>
      </div>

      <Table columns={columns} data={positions} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPos ? '编辑职位' : '新增职位'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">职位名称</label>
            <input
              type="text"
              className="form-input"
              value={formData.pos_name}
              onChange={(e) => setFormData({ ...formData, pos_name: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">基本工资</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.base_salary}
                onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">职级</label>
              <input
                type="text"
                className="form-input"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingPos ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

