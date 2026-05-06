import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Terminal as TerminalIcon, ShieldAlert, Cpu, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password);
      toast.success('NODE_PROVISIONED: ACCESS_GRANTED', {
        style: {
          background: '#0d0208',
          color: '#00ff41',
          border: '1px solid #00ff41',
          fontFamily: 'monospace'
        },
      });
      navigate('/');
    } catch (err) {
      toast.error('PROVISION_FAILED: SYSTEM_REJECTED', {
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
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-ubuntu-purple/10 blur-[150px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-[460px] z-10"
      >
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-white/30 hover:text-terminal-green transition-colors text-[10px] uppercase tracking-widest mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal_Auth
        </Link>

        <div className="glass-card">
          <div className="bg-white/5 border-b border-white/5 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ubuntu-purple to-transparent opacity-50"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ubuntu-purple/10 border border-ubuntu-purple/20 rounded-2xl mb-4 text-ubuntu-purple shadow-[0_0_20px_rgba(119,33,111,0.3)]">
              <UserPlus size={32} />
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-[0.1em] uppercase mb-1">
              New <span className="text-ubuntu-purple">Identity</span>
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
              Provisioning system credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ubuntu-purple uppercase tracking-widest ml-1">Proposed_ID</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="terminal-input focus:border-ubuntu-purple/50 text-ubuntu-purple"
                placeholder="new_node_id"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ubuntu-purple uppercase tracking-widest ml-1">New_Access_Key</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="terminal-input focus:border-ubuntu-purple/50 text-ubuntu-purple"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-ubuntu-purple/10 hover:bg-ubuntu-purple/20 text-ubuntu-purple border border-ubuntu-purple/30 rounded-lg py-4 font-mono font-bold transition-all shadow-[0_0_15px_rgba(119,33,111,0.2)] hover:shadow-[0_0_25px_rgba(119,33,111,0.4)] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-ubuntu-purple/30 border-t-ubuntu-purple rounded-full animate-spin"></div>
              ) : (
                <>
                  <Cpu size={18} />
                  PROVISION_IDENTITY
                </>
              )}
            </motion.button>
          </form>

          <div className="px-8 pb-8 text-center border-t border-white/5 pt-6 mx-8">
            <div className="flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-tighter">
              <ShieldAlert size={12} className="text-ubuntu-purple" />
              <span>Encryption Active: SHA-512 Standard</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
