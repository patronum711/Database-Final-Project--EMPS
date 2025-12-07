import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import PositionManagement from './pages/PositionManagement';
import ContractManagement from './pages/ContractManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import RewardPunishManagement from './pages/RewardPunishManagement';
import TrainingManagement from './pages/TrainingManagement';
import JobChangeManagement from './pages/JobChangeManagement';
import SalaryManagement from './pages/SalaryManagement';
import './App.css';

// 路由守卫组件
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  // 生产环境部署在子路径 /epms 下
  const basename = import.meta.env.PROD ? '/epms' : '';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Layout>
                <EmployeeManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <PrivateRoute>
              <Layout>
                <DepartmentManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/positions"
          element={
            <PrivateRoute>
              <Layout>
                <PositionManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <PrivateRoute>
              <Layout>
                <ContractManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/attendances"
          element={
            <PrivateRoute>
              <Layout>
                <AttendanceManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reward-punish"
          element={
            <PrivateRoute>
              <Layout>
                <RewardPunishManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/training"
          element={
            <PrivateRoute>
              <Layout>
                <TrainingManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/job-changes"
          element={
            <PrivateRoute>
              <Layout>
                <JobChangeManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/salary"
          element={
            <PrivateRoute>
              <Layout>
                <SalaryManagement />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
