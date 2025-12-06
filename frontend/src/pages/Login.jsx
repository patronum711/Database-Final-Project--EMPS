import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 演示模式登录（无需后端）
  const handleDemoLogin = () => {
    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('demo-mode', 'true');
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      // 拦截器已自动提取 Result.data，所以 response 直接是 LoginResponseDTO
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.removeItem('demo-mode');
        navigate('/dashboard');
      } else {
        setError('登录失败，请检查用户名和密码');
      }
    } catch (err) {
      // 如果后端不可用，提示用户使用演示模式
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('无法连接到后端服务器，请使用演示模式登录');
      } else {
        setError(err.response?.data?.message || '登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>员工人事管理系统</h1>
          <p>EPMS - Employee Personnel Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div className="demo-section">
          <button
            type="button"
            className="demo-login-btn"
            onClick={handleDemoLogin}
          >
            🚀 演示模式登录
          </button>
        </div>
      </div>
    </div>
  );
}

