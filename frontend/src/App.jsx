import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FileProvider } from './context/FileContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import ActivityLogs from './pages/ActivityLogs';
import FileDetails from './pages/FileDetails';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0d0208] text-terminal-green font-mono gap-4">
      <div className="w-10 h-10 border-4 border-terminal-green/20 border-t-terminal-green rounded-full animate-spin"></div>
      <p className="text-[10px] uppercase tracking-[0.3em]">Authenticating Node...</p>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0d0208] text-terminal-green font-mono gap-4">
      <div className="w-10 h-10 border-4 border-terminal-green/20 border-t-terminal-green rounded-full animate-spin"></div>
      <p className="text-[10px] uppercase tracking-[0.3em]">Checking Privileges...</p>
    </div>
  );
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d0208',
                color: '#EEEEEC',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'monospace',
                fontSize: '12px'
              }
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="files/:id" element={<FileDetails />} />
              <Route path="users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="logs" element={<ActivityLogs />} />
            </Route>
          </Routes>
        </Router>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;
