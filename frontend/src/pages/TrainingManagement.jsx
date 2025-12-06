import { useState, useEffect } from 'react';
import { trainingAPI, employeeAPI } from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import './EmployeeManagement.css';
import '../components/Form.css';

export default function TrainingManagement() {
  const [courses, setCourses] = useState([]);
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    course_name: '',
    start_time: '',
    end_time: '',
    location: '',
    trainer: '',
  });
  const [recordFormData, setRecordFormData] = useState({
    emp_id: '',
    course_id: '',
    score: '',
    is_completed: false,
  });

  const loadData = async () => {
    try {
      const [courseData, recordData, empData] = await Promise.all([
        trainingAPI.getAllCourses(),
        trainingAPI.getTrainingRecords(),
        employeeAPI.getAll(),
      ]);
      setCourses(courseData || []);
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

  // 课程管理
  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      course_name: '',
      start_time: '',
      end_time: '',
      location: '',
      trainer: '',
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      course_name: course.course_name || '',
      start_time: course.start_time ? course.start_time.substring(0, 16) : '',
      end_time: course.end_time ? course.end_time.substring(0, 16) : '',
      location: course.location || '',
      trainer: course.trainer || '',
    });
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (course) => {
    if (!confirm(`确定要删除课程 ${course.course_name} 吗？`)) return;
    try {
      await trainingAPI.deleteCourse(course.course_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await trainingAPI.updateCourse(editingCourse.course_id, courseFormData);
      } else {
        await trainingAPI.createCourse(courseFormData);
      }
      alert(editingCourse ? '更新成功' : '创建成功');
      setIsCourseModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingCourse ? '更新失败' : '创建失败');
    }
  };

  // 培训记录管理
  const handleAddRecord = () => {
    setEditingRecord(null);
    setRecordFormData({
      emp_id: '',
      course_id: '',
      score: '',
      is_completed: false,
    });
    setIsRecordModalOpen(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setRecordFormData({
      emp_id: record.emp_id || '',
      course_id: record.course_id || '',
      score: record.score || '',
      is_completed: record.is_completed || false,
    });
    setIsRecordModalOpen(true);
  };

  const handleDeleteRecord = async (record) => {
    if (!confirm('确定要删除该培训记录吗？')) return;
    try {
      await trainingAPI.deleteTrainingRecord(record.emp_id, record.course_id);
      alert('删除成功');
      loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    try {
      const empId = parseInt(recordFormData.emp_id);
      const courseId = parseInt(recordFormData.course_id);
      
      if (isNaN(empId) || isNaN(courseId)) {
        alert('请选择有效的员工和课程');
        return;
      }
      
      const data = {
        ...recordFormData,
        emp_id: empId,
        course_id: courseId,
        score: recordFormData.score ? parseFloat(recordFormData.score) : null,
      };
      if (editingRecord) {
        await trainingAPI.updateTrainingRecord(
          empId,
          courseId,
          data
        );
      } else {
        await trainingAPI.enrollEmployee(data);
      }
      alert(editingRecord ? '更新成功' : '创建成功');
      setIsRecordModalOpen(false);
      loadData();
    } catch (error) {
      alert(editingRecord ? '更新失败' : '创建失败');
    }
  };

  const courseColumns = [
    { key: 'course_id', title: '课程编号', width: '100px' },
    { key: 'course_name', title: '课程名称', width: '200px' },
    { key: 'start_time', title: '开始时间', width: '160px' },
    { key: 'end_time', title: '结束时间', width: '160px' },
    { key: 'location', title: '地点', width: '150px' },
    { key: 'trainer', title: '培训师', width: '120px' },
  ];

  const recordColumns = [
    {
      key: 'emp_name',
      title: '员工姓名',
      width: '120px',
      render: (_, row) => row.emp_name || '-',
    },
    {
      key: 'course_name',
      title: '课程名称',
      width: '200px',
      render: (_, row) => row.course_name || '-',
    },
    {
      key: 'score',
      title: '成绩',
      width: '100px',
      render: (score) => (score ? `${parseFloat(score).toFixed(2)}` : '-'),
    },
    {
      key: 'is_completed',
      title: '是否完成',
      width: '100px',
      render: (completed) => (
        <span className={`status-badge ${completed ? 'success' : 'warning'}`}>
          {completed ? '已完成' : '进行中'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>培训管理</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            课程管理
          </button>
          <button
            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            培训记录
          </button>
        </div>
      </div>

      {activeTab === 'courses' && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <button className="btn-add" onClick={handleAddCourse}>
              + 新增课程
            </button>
          </div>
          <Table
            columns={courseColumns}
            data={courses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        </>
      )}

      {activeTab === 'records' && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <button className="btn-add" onClick={handleAddRecord}>
              + 新增培训记录
            </button>
          </div>
          <Table
            columns={recordColumns}
            data={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </>
      )}

      {/* 课程模态框 */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? '编辑课程' : '新增课程'}
        width="600px"
      >
        <form onSubmit={handleSubmitCourse}>
          <div className="form-group">
            <label className="form-label required">课程名称</label>
            <input
              type="text"
              className="form-input"
              value={courseFormData.course_name}
              onChange={(e) =>
                setCourseFormData({ ...courseFormData, course_name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">开始时间</label>
              <input
                type="datetime-local"
                className="form-input"
                value={courseFormData.start_time}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, start_time: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">结束时间</label>
              <input
                type="datetime-local"
                className="form-input"
                value={courseFormData.end_time}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, end_time: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">地点</label>
              <input
                type="text"
                className="form-input"
                value={courseFormData.location}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, location: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">培训师</label>
              <input
                type="text"
                className="form-input"
                value={courseFormData.trainer}
                onChange={(e) =>
                  setCourseFormData({ ...courseFormData, trainer: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsCourseModalOpen(false)}
            >
              取消
            </button>
            <button type="submit" className="btn-primary">
              {editingCourse ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 培训记录模态框 */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={editingRecord ? '编辑培训记录' : '新增培训记录'}
      >
        <form onSubmit={handleSubmitRecord}>
          <div className="form-group">
            <label className="form-label required">员工</label>
            <select
              className="form-select"
              value={recordFormData.emp_id}
              onChange={(e) =>
                setRecordFormData({ ...recordFormData, emp_id: e.target.value })
              }
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
          <div className="form-group">
            <label className="form-label required">课程</label>
            <select
              className="form-select"
              value={recordFormData.course_id}
              onChange={(e) =>
                setRecordFormData({ ...recordFormData, course_id: e.target.value })
              }
              required
            >
              <option value="">请选择课程</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">成绩</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={recordFormData.score}
                onChange={(e) =>
                  setRecordFormData({ ...recordFormData, score: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">是否完成</label>
              <select
                className="form-select"
                value={recordFormData.is_completed ? 'true' : 'false'}
                onChange={(e) =>
                  setRecordFormData({
                    ...recordFormData,
                    is_completed: e.target.value === 'true',
                  })
                }
              >
                <option value="false">进行中</option>
                <option value="true">已完成</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsRecordModalOpen(false)}
            >
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

