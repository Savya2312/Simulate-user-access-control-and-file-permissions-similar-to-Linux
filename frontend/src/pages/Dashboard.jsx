import { useEffect, useState } from 'react';
import { useFiles } from '../context/FileContext';
import { useAuth } from '../context/AuthContext';
import FileGrid from '../components/FileGrid';
import CreateFileModal from '../components/CreateFileModal';
import Terminal from '../components/Terminal';
import StatsPanel from '../components/StatsPanel';
import { 
  Plus, 
  FolderPlus, 
  Search, 
  Filter, 
  Cpu, 
  Database, 
  LayoutGrid, 
  List,
  Shield,
  Activity,
  User as UserIcon,
  Terminal as LucideTerminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { files, loading, fetchFiles, logs, fetchLogs } = useFiles();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('file');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchFiles();
    fetchLogs();
  }, [fetchFiles, fetchLogs]);

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in font-mono">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-terminal-green rounded-full shadow-neon"></div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              NODE_EXPLORER
            </h2>
          </div>
          <p className="text-terminal-green/40 text-xs font-bold ml-5 uppercase tracking-[0.3em]">
            Root / {user?.username} / <span className="text-terminal-green">workspace</span>
          </p>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-terminal-green transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="grep pattern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-terminal-green/50 w-72 transition-all shadow-inner placeholder:text-white/10 text-terminal-green"
            />
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-terminal-green/10 text-terminal-green' : 'text-white/20 hover:text-white/40'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-terminal-green/10 text-terminal-green' : 'text-white/20 hover:text-white/40'}`}
            >
              <List size={18} />
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setModalType('file'); setIsModalOpen(true); }}
            className="terminal-btn !py-2.5 !px-6 !w-auto text-xs"
          >
            <Plus size={16} />
            <span>TOUCH_FILE</span>
          </motion.button>
        </div>
      </header>

      <StatsPanel files={files} logs={logs} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-12">
          <FileGrid files={filteredFiles} loading={loading} viewMode={viewMode} />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.5em] flex items-center gap-3">
                <LucideTerminal size={14} className="text-terminal-green" />
                Primary Console Instance
              </h3>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
            </div>
            <Terminal />
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 space-y-8"
          >
            <div>
              <h3 className="font-black text-[10px] text-white/20 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Cpu size={14} className="text-terminal-green" />
                Sys_Metrics
              </h3>
              <div className="space-y-6">
                <StatusItem label="Total Inodes" value={files.length} icon={<Database size={14}/>} color="terminal-green" />
                <StatusItem label="Owner UID" value={user?.username} icon={<UserIcon size={14}/>} color="ubuntu-purple" />
                <StatusItem label="Kernel" value="v6.8.0" icon={<Shield size={14}/>} color="terminal-green" />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="font-black text-[10px] text-white/20 uppercase tracking-[0.3em] mb-6">Executables</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setModalType('folder'); setIsModalOpen(true); }}
                  className="p-5 bg-black/40 hover:bg-terminal-green/5 rounded-2xl border border-white/5 flex flex-col items-center gap-3 transition-all group"
                >
                  <FolderPlus size={20} className="text-terminal-green/40 group-hover:text-terminal-green transition-colors" />
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Mkdir</span>
                </button>
                <button className="p-5 bg-black/40 hover:bg-ubuntu-purple/5 rounded-2xl border border-white/5 flex flex-col items-center gap-3 transition-all group">
                  <Shield size={20} className="text-ubuntu-purple/40 group-hover:text-ubuntu-purple transition-colors" />
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sudo</span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="p-8 rounded-2xl bg-black border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 to-transparent opacity-50"></div>
            <h3 className="font-black text-xs text-terminal-green uppercase tracking-widest mb-3 relative z-10">Tip of the Session</h3>
            <p className="text-[11px] text-white/40 leading-relaxed relative z-10 font-medium">
              Run <code className="text-terminal-green bg-black/50 px-1 rounded">chmod 755</code> to grant read/execute permissions to everyone while keeping write access private.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateFileModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            type={modalType}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusItem = ({ label, value, icon, color }) => {
  // Map color names to classes safely
  const colorMap = {
    'terminal-green': 'text-terminal-green bg-terminal-green/10',
    'ubuntu-purple': 'text-ubuntu-purple bg-ubuntu-purple/10',
    'ubuntu-orange': 'text-ubuntu-orange bg-ubuntu-orange/10'
  };
  
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${colorMap[color] || 'text-white bg-white/10'}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-black text-white/60 font-mono truncate max-w-[80px]">{value}</span>
    </div>
  );
};

export default Dashboard;
