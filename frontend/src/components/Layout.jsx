import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-terminal-black overflow-hidden font-mono">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ubuntu-purple/5 blur-[150px] rounded-full -z-10"></div>
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10 relative">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
