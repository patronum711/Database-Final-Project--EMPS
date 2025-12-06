import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI, departmentAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function AttendanceManagement() {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    work_date: '',
    type: '正常',
    hours: '8.0',
    remarks: '',
  });
  const [batchFormData, setBatchFormData] = useState({
    dept_id: '',
    work_date: '',
    type: '正常',
  });

  const loadData = async () => {
    try {
      const [attData, empData, deptData] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ]);
      setAttendances(attData || []);
      setEmployees(empData || []);
      setDepartments(deptData || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingAttendance(null);
    setFormData({
      emp_id: '',
      work_date: '',
      type: '正常',
      hours: '8.0',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setFormData({
      emp_id: attendance.emp_id || '',
      work_date: attendance.work_date || '',
      type: attendance.type || '正常',
      hours: attendance.hours || '8.0',
      remarks: attendance.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (attendance) => {
    if (!confirm('确定要删除该考勤记录吗？')) return;
    try {
      await attendanceAPI.delete(attendance.record_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  // 批量考勤录入（调用存储过程 sp_batch_attendance）
  const handleBatchAdd = () => {
    setBatchFormData({
      dept_id: '',
      work_date: '',
      type: '正常',
    });
    setIsBatchModalOpen(true);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      const deptId = parseInt(batchFormData.dept_id);
      if (isNaN(deptId)) {
        alert('请选择部门');
        return;
      }

      const result = await attendanceAPI.batchCreate(
        deptId,
        batchFormData.work_date,
        batchFormData.type
      );
      
      alert(result.message || `批量录入成功，影响 ${result.affected_rows || result.p_affected_rows || 0} 条记录`);
      setIsBatchModalOpen(false);
      loadData();
    } catch (error) {
      console.error('批量录入失败:', error);
      alert('批量录入失败：' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empId = parseInt(formData.emp_id);
      const hours = parseFloat(formData.hours) || 8.0;
      
      if (isNaN(empId)) {
        alert('请选择有效的员工');
        return;
      }
      
      const data = {
        ...formData,
        emp_id: empId,
        hours: hours,
      };
      if (editingAttendance) {
        await attendanceAPI.update(editingAttendance.record_id, data);
      } else {
        await attendanceAPI.create(data);
      }
      alert(editingAttendance ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingAttendance ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { key: 'record_id', title: '记录编号', width: '100px' },
    {
      key: 'emp_name',
      title: '员工姓名',
      width: '120px',
      render: (_, row) => row.emp_name || '-',
    },
    { key: 'work_date', title: '工作日期', width: '120px' },
    { key: 'type', title: '类型', width: '100px' },
    {
      key: 'hours',
      title: '时长(小时)',
      width: '120px',
      render: (hours) => `${parseFloat(hours || 0).toFixed(1)}h`,
    },
    { key: 'remarks', title: '备注', width: '200px' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>考勤管理</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-add" onClick={handleAdd}>
            + 新增考勤记录
          </button>
          <button 
            className="btn-batch" 
            onClick={handleBatchAdd}
          >
            📋 批量录入
          </button>
        </div>
      </div>

      <Table
        columns={columns}
        data={attendances}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAttendance ? '编辑考勤记录' : '新增考勤记录'}
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
              <label className="form-label required">工作日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.work_date}
                onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">类型</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="正常">正常</option>
                <option value="迟到">迟到</option>
                <option value="早退">早退</option>
                <option value="旷工">旷工</option>
                <option value="请假">请假</option>
                <option value="出差">出差</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">时长(小时)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">备注</label>
            <textarea
              className="form-textarea"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingAttendance ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 批量录入模态框 */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="批量考勤录入"
        width="500px"
      >
        <form onSubmit={handleBatchSubmit}>
          <div className="form-group">
            <label className="form-label required">部门</label>
            <select
              className="form-select"
              value={batchFormData.dept_id}
              onChange={(e) => setBatchFormData({ ...batchFormData, dept_id: e.target.value })}
              required
            >
              <option value="">请选择部门</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">工作日期</label>
            <input
              type="date"
              className="form-input"
              value={batchFormData.work_date}
              onChange={(e) => setBatchFormData({ ...batchFormData, work_date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">考勤类型</label>
            <select
              className="form-select"
              value={batchFormData.type}
              onChange={(e) => setBatchFormData({ ...batchFormData, type: e.target.value })}
            >
              <option value="正常">正常</option>
              <option value="迟到">迟到</option>
              <option value="早退">早退</option>
              <option value="旷工">旷工</option>
              <option value="请假">请假</option>
              <option value="出差">出差</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsBatchModalOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              批量录入
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

