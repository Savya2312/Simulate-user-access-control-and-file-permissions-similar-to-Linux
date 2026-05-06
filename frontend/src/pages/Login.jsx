import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal as TerminalIcon, ShieldCheck, Lock, User, Cpu, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Background boot sequence simulation
  useEffect(() => {
    const lines = [
      '[ OK ] Started LSB: Virtual File System Daemon.',
      '[ OK ] Initializing Secure Kernel...',
      '[ OK ] Mounted /dev/vda1 on /mnt/storage',
      'System: x86_64 Linux 6.8.0-40-generic',
      'Network: Ethernet eth0 up',
      'Auth: JWT Service Active',
      '----------------------------------------'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('ACCESS GRANTED', {
        style: {
          background: '#0d0208',
          color: '#00ff41',
          border: '1px solid #00ff41',
          fontFamily: 'monospace'
        },
      });
      navigate('/');
    } catch (err) {
      toast.error('AUTH_FAILURE: ACCESS DENIED', {
        style: {
          background: '#0d0208',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0208] flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Neon Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ubuntu-purple/20 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-terminal-green/5 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-[460px] z-10 flex flex-col gap-6">
        {/* Top Terminal Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] text-terminal-green/60 leading-tight shadow-2xl backdrop-blur-md"
        >
          {terminalLines.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-40">[{i.toString().padStart(2, '0')}]</span>
              <span>{line}</span>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 text-terminal-green animate-pulse">
              <span className="opacity-40">[{terminalLines.length.toString().padStart(2, '0')}]</span>
              <span>AUTH_REQUEST_SENT: PENDING_VERIFICATION...</span>
            </div>
          )}
        </motion.div>

        {/* Main Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white/5 border-b border-white/5 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terminal-green to-transparent opacity-50"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-terminal-green/10 border border-terminal-green/20 rounded-2xl mb-4 text-terminal-green shadow-neon">
              <ShieldCheck size={32} />
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-[0.1em] uppercase mb-1">
              Auth <span className="text-terminal-green">Portal</span>
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
              Node_ID: simulator-vfs-01
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-terminal-green uppercase tracking-widest flex items-center gap-1.5">
                  <User size={12} />
                  User_Identity
                </label>
                <span className="text-[9px] text-white/20">Required</span>
              </div>
              <input 
                type="text" 
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="terminal-input"
                placeholder="root@simulator"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-terminal-green uppercase tracking-widest flex items-center gap-1.5">
                  <Lock size={12} />
                  Access_Key
                </label>
                <span className="text-[9px] text-white/20">AES_256</span>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="terminal-input"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="terminal-btn group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-terminal-green/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Cpu size={18} />
                    INITIALIZE_LOGIN
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 flex flex-col gap-4">
            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-[11px] text-white/40">
                Connection Status: <span className="text-terminal-green animate-pulse">ENCRYPTED</span>
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/20">
              <Link to="/register" className="hover:text-terminal-green transition-colors border-b border-white/5 hover:border-terminal-green pb-0.5">
                REGISTER_NEW_NODE
              </Link>
              <span>•</span>
              <a href="#" className="hover:text-terminal-green transition-colors">FORGOT_KEY</a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Banner */}
        <div className="flex items-center justify-between text-[9px] text-white/20 px-2 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <AlertCircle size={10} />
            <span>Unauthorized access is prohibited</span>
          </div>
          <span>© 2026 Ubuntu_VFS</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
