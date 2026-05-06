import { useEffect } from 'react';
import { useFiles } from '../context/FileContext';
import { Activity, ShieldAlert, CheckCircle, Clock, Trash2, Filter, Search } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ActivityLogs = () => {
  const { logs, fetchLogs } = useFiles();

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    if (window.confirm('Clear all system logs?')) {
      try {
        await api.delete('/logs');
        fetchLogs();
        toast.success('System logs purged');
      } catch (err) {
        toast.error('Privileged access required');
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-in font-mono">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-ubuntu-purple rounded-full shadow-[0_0_15px_rgba(119,33,111,0.5)]"></div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              AUDIT_TRAILS
            </h2>
          </div>
          <p className="text-white/40 text-[10px] font-bold ml-5 uppercase tracking-[0.3em]">
            Security / <span className="text-ubuntu-purple">events.log</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-ubuntu-purple transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter logs..."
              className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-6 py-2.5 text-xs focus:outline-none focus:border-ubuntu-purple/50 w-48 transition-all"
            />
          </div>
          <button 
            onClick={handleClearLogs}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Trash2 size={14} />
            Purge History
          </button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              <tr>
                <th className="px-8 py-6">State</th>
                <th className="px-6 py-6">Operator</th>
                <th className="px-6 py-6">Operation</th>
                <th className="px-6 py-6">Resource</th>
                <th className="px-8 py-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-10">
                      <Activity size={48} />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No events recorded</p>
                    </div>
                  </td>
                </tr>
              ) : logs.map((log, index) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  key={log._id} 
                  className="table-row-hover group"
                >
                  <td className="px-8 py-5">
                    {log.status === 'success' ? (
                      <div className="flex items-center gap-2 text-terminal-green">
                        <CheckCircle size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Authorized</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <ShieldAlert size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Violated</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/40 font-black border border-white/5 group-hover:border-terminal-green/30 transition-colors">
                        {log.username?.[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-white/80 group-hover:text-white">{log.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                      log.status === 'denied' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-terminal-green/10 border-terminal-green/20 text-terminal-green'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono text-white/40 truncate max-w-[150px] inline-block">{log.target}</span>
                  </td>
                  <td className="px-8 py-5 text-right flex items-center justify-end gap-2 text-[10px] text-white/20 font-mono">
                    <Clock size={12} />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityLogs;
