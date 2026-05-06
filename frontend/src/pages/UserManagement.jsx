import { useEffect, useState } from 'react';
import { Users, Shield, Trash2, UserPlus, Key, Fingerprint, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Identity fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('IRREVERSIBLE ACTION: Purge this user from the main system?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('Identity purged');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unauthorized action');
      }
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      toast.success(`Role elevation: ${newRole.toUpperCase()}`);
    } catch (err) {
      toast.error('Privilege modification failed');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in font-mono">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-ubuntu-orange rounded-full shadow-neon"></div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              IDENTITIES
            </h2>
          </div>
          <p className="text-white/40 text-[10px] font-bold ml-5 uppercase tracking-[0.3em]">
            Security / <span className="text-ubuntu-orange">access_control.db</span>
          </p>
        </div>
        
        <button className="terminal-btn !py-2.5 !px-6 !w-auto text-xs">
          <UserPlus size={16} />
          PROVISION_NEW_NODE
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass-card h-64 animate-pulse"></div>)
        ) : users.map((user, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={user._id} 
            className="glass-card p-10 group relative border-white/5 hover:border-terminal-green/30"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint size={120} />
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6 transition-all duration-500 ${
                user.role === 'admin' ? 'bg-terminal-green/20 text-terminal-green shadow-terminal-green/20' : 'bg-white/5 text-white/40'
              }`}>
                {user.username[0].toUpperCase()}
              </div>
              <h3 className="font-black text-2xl text-white mb-2 tracking-tight">{user.username}</h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${
                user.role === 'admin' ? 'border-terminal-green text-terminal-green bg-terminal-green/5' : 'border-white/10 text-white/40 bg-white/5'
              }`}>
                {user.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                {user.role}
              </div>
            </div>

            <div className="space-y-4 mb-8 bg-black/40 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
                <span>Primary Group</span>
                <span className="text-terminal-green font-mono">{user.primaryGroup?.name || 'ROOT'}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
                <span>Joined</span>
                <span className="text-white/60 font-mono">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => toggleRole(user)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-terminal-green/10 text-white/40 hover:text-terminal-green border border-white/5 rounded-xl transition-all"
              >
                <Key size={14} />
                Elevate
              </button>
              <button 
                onClick={() => handleDeleteUser(user._id)}
                className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
