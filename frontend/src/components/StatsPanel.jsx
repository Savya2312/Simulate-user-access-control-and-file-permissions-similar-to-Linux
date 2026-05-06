import { motion } from 'framer-motion';
import { Activity, Shield, HardDrive, Lock } from 'lucide-react';

const StatsPanel = ({ files, logs }) => {
  const fileCount = files.length;
  const folderCount = files.filter(f => f.type === 'folder').length;
  const successLogs = logs.filter(l => l.status === 'success').length;
  const deniedLogs = logs.filter(l => l.status === 'denied').length;
  
  const totalLogs = logs.length || 1;
  const successRate = Math.round((successLogs / totalLogs) * 100);

  const stats = [
    { label: 'System Health', value: '98.2%', color: 'terminal-green' },
    { label: 'Access Rate', value: `${successRate}%`, color: 'ubuntu-purple' },
    { label: 'Disk Load', value: `${Math.min(fileCount * 2, 100)}%`, color: 'ubuntu-orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={stat.label}
          className="glass-card p-6 flex items-center justify-between group overflow-hidden relative"
        >
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            {i === 0 ? <Activity size={100} /> : i === 1 ? <Shield size={100} /> : <HardDrive size={100} />}
          </div>
          
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
            <h4 className="text-2xl font-black text-white">{stat.value}</h4>
          </div>

          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="175.93"
                initial={{ strokeDashoffset: 175.93 }}
                animate={{ strokeDashoffset: 175.93 - (175.93 * parseInt(stat.value)) / 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className={stat.color === 'terminal-green' ? 'text-terminal-green' : stat.color === 'ubuntu-purple' ? 'text-ubuntu-purple' : 'text-ubuntu-orange'}
              />
            </svg>
            <div className={`absolute w-1.5 h-1.5 rounded-full ${stat.color === 'terminal-green' ? 'bg-terminal-green shadow-neon' : stat.color === 'ubuntu-purple' ? 'bg-ubuntu-purple' : 'bg-ubuntu-orange'}`}></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPanel;
