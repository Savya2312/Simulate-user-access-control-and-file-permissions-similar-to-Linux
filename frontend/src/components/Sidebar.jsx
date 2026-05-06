import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, 
  Users, 
  Terminal as TerminalIcon, 
  LogOut, 
  Shield, 
  Activity,
  Home,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Node Explorer', icon: Folder },
    { path: '/logs', label: 'Audit Trail', icon: Activity },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/users', label: 'Identity Mgr', icon: Users });
  }

  return (
    <aside className="w-72 bg-black border-r border-white/5 flex flex-col h-full z-20 font-mono">
      <div className="p-8 flex items-center gap-4 mb-4">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="p-2.5 bg-terminal-green/10 border border-terminal-green/20 rounded-xl shadow-[0_0_15px_rgba(0,255,65,0.1)]"
        >
          <ShieldCheck className="text-terminal-green w-6 h-6" />
        </motion.div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            Linux<span className="text-terminal-green">Sim</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse"></div>
            <span className="text-[10px] text-terminal-green/60 font-bold uppercase tracking-widest">
              Online
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
          Core_Modules
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`sidebar-item group ${isActive ? 'sidebar-item-active' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={18} className={`${isActive ? 'text-terminal-green' : 'group-hover:text-terminal-green transition-colors'}`} />
              <span className="font-bold text-xs uppercase tracking-wider flex-1">{item.label}</span>
              {isActive && <motion.div layoutId="activeDot" className="w-1 h-3 bg-terminal-green rounded-full shadow-[0_0_10px_rgba(0,255,65,0.5)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 m-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-lg bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green font-black">
            {user?.username?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase">{user?.username}</p>
            <p className="text-[9px] text-terminal-green/50 uppercase font-bold tracking-tighter">
              {user?.role}_access
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all w-full text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={12} />
          Term_Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
