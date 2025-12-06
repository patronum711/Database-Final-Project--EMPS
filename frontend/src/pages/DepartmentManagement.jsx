import { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ dept_name: '', location: '' });

  const loadData = async () => {
    try {
      const data = await departmentAPI.getAll();
      setDepartments(data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingDept(null);
    setFormData({ dept_name: '', location: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ dept_name: dept.dept_name || '', location: dept.location || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (dept) => {
    if (!confirm(`确定要删除部门 ${dept.dept_name} 吗？`)) return;
    try {
      await departmentAPI.delete(dept.dept_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentAPI.update(editingDept.dept_id, formData);
      } else {
        await departmentAPI.create(formData);
      }
      alert(editingDept ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingDept ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'dept_id', title: '部门编号', width: '100px' },
    { key: 'dept_name', title: '部门名称', width: '200px' },
    { key: 'location', title: '地址', width: '300px' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>部门管理</h2>
        <button className="btn-add" onClick={handleAdd}>
          + 新增部门
        </button>
      </div>

      <Table columns={columns} data={departments} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? '编辑部门' : '新增部门'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">部门名称</label>
            <input
              type="text"
              className="form-input"
              value={formData.dept_name}
              onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">地址</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingDept ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

