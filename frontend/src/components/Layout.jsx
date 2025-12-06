import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Layout.css';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取当前用户信息
  useEffect(() => {
    const loadCurrentUser = async () => {
      // 检查是否是演示模式
      const isDemoMode = localStorage.getItem('demo-mode') === 'true';
      if (isDemoMode) {
        // 演示模式下使用默认用户信息
        setCurrentUser({
          username: '演示用户',
          role: 'ADMIN'
        });
        setLoading(false);
        return;
      }

      try {
        const user = await authAPI.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 如果获取失败，可能是token过期，清除token并跳转到登录页
        const isDemoMode = localStorage.getItem('demo-mode') === 'true';
        if (!isDemoMode) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo-mode');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: '首页', icon: '🏠' },
    { path: '/employees', label: '员工管理', icon: '👥' },
    { path: '/departments', label: '部门管理', icon: '🏢' },
    { path: '/positions', label: '职位管理', icon: '💼' },
    { path: '/contracts', label: '合同管理', icon: '📄' },
    { path: '/attendances', label: '考勤管理', icon: '⏰' },
    { path: '/reward-punish', label: '奖惩管理', icon: '⭐' },
    { path: '/training', label: '培训管理', icon: '📚' },
    { path: '/job-changes', label: '人事变动', icon: '🔄' },
    { path: '/salary', label: '工资计算', icon: '💰' },
  ];

  // 角色中文映射
  const roleMap = {
    'ADMIN': '管理员',
    'HR': '人事',
    'EMPLOYEE': '员工'
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>EPMS系统</h2>
          <p>员工人事管理</p>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>员工人事管理系统</h1>
          <div className="header-right">
            {loading ? (
              <span className="user-info">加载中...</span>
            ) : currentUser ? (
              <div className="user-info">
                <span className="user-name">👤 {currentUser.username}</span>
                <span className="user-role">{roleMap[currentUser.role] || currentUser.role}</span>
              </div>
            ) : (
              <span className="user-info">未登录</span>
            )}
            <button onClick={handleLogout} className="logout-btn">
              🚪 退出登录
            </button>
          </div>
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}

