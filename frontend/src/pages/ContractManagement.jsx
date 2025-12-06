import { useState, useEffect } from 'react';
import { contractAPI, employeeAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    type: '固定期限',
    start_date: '',
    end_date: '',
    status: '有效',
  });

  const loadData = async () => {
    try {
      const [contractData, empData] = await Promise.all([
        contractAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setContracts(contractData || []);
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
    setEditingContract(null);
    setFormData({
      emp_id: '',
      type: '固定期限',
      start_date: '',
      end_date: '',
      status: '有效',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      emp_id: contract.emp_id || '',
      type: contract.type || '固定期限',
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      status: contract.status || '有效',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (contract) => {
    if (!confirm('确定要删除该合同吗？')) return;
    try {
      await contractAPI.delete(contract.contract_id);
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
      if (isNaN(empId)) {
        alert('请选择有效的员工');
        return;
      }
      
      const data = {
        ...formData,
        emp_id: empId,
      };
      if (editingContract) {
        await contractAPI.update(editingContract.contract_id, data);
      } else {
        await contractAPI.create(data);
      }
      alert(editingContract ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingContract ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'contract_id', title: '合同编号', width: '100px' },
    {
      key: 'emp_name',
      title: '员工姓名',
      width: '120px',
      render: (_, row) => row.emp_name || '-',
    },
    { key: 'type', title: '合同类型', width: '120px' },
    { key: 'start_date', title: '开始日期', width: '120px' },
    { key: 'end_date', title: '结束日期', width: '120px' },
    {
      key: 'status',
      title: '状态',
      width: '80px',
      render: (status) => {
        const statusMap = { 有效: 'success', 过期: 'danger', 解除: 'warning' };
        return <span className={`status-badge ${statusMap[status] || ''}`}>{status}</span>;
      },
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>合同管理</h2>
        <button className="btn-add" onClick={handleAdd}>
          + 新增合同
        </button>
      </div>

      <Table
        columns={columns}
        data={contracts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContract ? '编辑合同' : '新增合同'}
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
              <label className="form-label required">合同类型</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="固定期限">固定期限</option>
                <option value="无固定期限">无固定期限</option>
                <option value="实习">实习</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">状态</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="有效">有效</option>
                <option value="过期">过期</option>
                <option value="解除">解除</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">开始日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">结束日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingContract ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

