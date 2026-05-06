import { useState } from 'react';
import { useFiles } from '../context/FileContext';
import { X, FilePlus, FolderPlus, Shield, Terminal as TerminalIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateFileModal = ({ isOpen, onClose, type }) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('rwxr-xr-x');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { createFile } = useFiles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFile({ name, type, permissions, content });
      onClose();
    } catch (err) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[500px] glass-card shadow-2xl overflow-hidden font-mono"
      >
        <div className="bg-white/5 border-b border-white/5 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${type === 'folder' ? 'bg-ubuntu-purple/20 text-ubuntu-purple' : 'bg-terminal-green/20 text-terminal-green'}`}>
              {type === 'folder' ? <FolderPlus size={20} /> : <FilePlus size={20} />}
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Create_{type.toUpperCase()}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Label_Identity</label>
            <input 
              type="text" 
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="terminal-input"
              placeholder={type === 'folder' ? 'new_directory_name' : 'new_file_name.txt'}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Access_Bits (Mask)</label>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                required
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="terminal-input font-mono !text-terminal-green"
                placeholder="rwxr-xr-x"
              />
              <div className="flex gap-1">
                {['7', '5', '5'].map((n, i) => (
                  <span key={i} className="w-8 h-8 rounded bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {type === 'file' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Initial_Buffer_Data</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="terminal-input min-h-[120px] resize-none py-4"
                placeholder="// Enter file content here..."
              />
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
            >
              Cancel_Abort
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] terminal-btn !py-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={16} />
                  ALLOCATE_RESOURCE
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateFileModal;
