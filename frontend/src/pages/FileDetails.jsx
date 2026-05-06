import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Save, Trash2, Shield, Info, Edit3, Terminal as TerminalIcon, File as FileIcon, Clock, HardDrive } from 'lucide-react';
import ChmodPanel from '../components/ChmodPanel';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const FileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteFile, updateFile } = useFiles();
  const { user } = useAuth();
  
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await api.get(`/files/${id}`);
        setFile(res.data);
        setContent(res.data.content);
      } catch (err) {
        toast.error('Permission denied: Object inaccessible');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id, navigate]);

  const handleSaveContent = async () => {
    try {
      await updateFile(id, { content });
      setFile(prev => ({ ...prev, content }));
      setIsEditing(false);
      toast.success('Inode content synchronized');
    } catch (err) {
      // Toast already shown by context
    }
  };

  const handleDelete = async () => {
    if (window.confirm('CRITICAL: Permanently purge this object from the disk?')) {
      await deleteFile(id);
      navigate('/');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-6 font-mono">
      <div className="w-12 h-12 border-[3px] border-terminal-green/20 border-t-terminal-green rounded-full animate-spin shadow-neon"></div>
      <p className="text-[10px] font-black text-terminal-green uppercase tracking-[0.4em] animate-pulse">Syncing Disk Sectors...</p>
    </div>
  );
  if (!file) return null;

  return (
    <div className="space-y-10 animate-fade-in font-mono">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-white/30 hover:text-terminal-green transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 group-hover:border-terminal-green/30 transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="font-black text-[10px] uppercase tracking-[0.3em]">Return_To_Root</span>
        </button>

        <div className="flex gap-4">
          {file.type === 'file' && (
            <button 
              onClick={() => isEditing ? handleSaveContent() : setIsEditing(true)}
              className={`px-8 py-3.5 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                isEditing ? 'bg-terminal-green text-black shadow-neon' : 'bg-black/40 text-white/40 hover:text-white border border-white/5'
              }`}
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Commit_Changes' : 'Modify_Inode'}
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="px-8 py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Trash2 size={16} />
            Purge_Object
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card shadow-2xl">
            <div className="bg-white/5 px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${file.type === 'folder' ? 'bg-ubuntu-purple/20 text-ubuntu-purple' : 'bg-terminal-green/20 text-terminal-green shadow-neon'}`}>
                  {file.type === 'folder' ? <HardDrive size={20} /> : <FileIcon size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Resource_Identifier</span>
                  <span className="font-mono text-sm text-white font-bold">{file.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-terminal-green shadow-neon animate-pulse"></div>
                <span className="text-[9px] text-terminal-green font-black uppercase tracking-[0.2em]">Active Session</span>
              </div>
            </div>
            
            <div className="p-0 min-h-[500px] flex flex-col bg-black/20">
              {file.type === 'folder' ? (
                <div className="flex-1 flex items-center justify-center opacity-5">
                  <div className="text-center">
                    <Shield size={160} className="mx-auto mb-8" />
                    <p className="text-3xl font-black uppercase tracking-[0.6em]">Directory_Node</p>
                  </div>
                </div>
              ) : (
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  readOnly={!isEditing}
                  spellCheck="false"
                  className={`flex-1 p-10 font-mono text-sm bg-transparent outline-none resize-none transition-all ${
                    isEditing ? 'text-terminal-green' : 'text-white/40'
                  }`}
                  placeholder="// No data segments in this block"
                />
              )}
            </div>
            {isEditing && (
              <div className="px-8 py-4 bg-terminal-green/5 border-t border-terminal-green/10 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping"></div>
                <span className="text-[9px] font-black text-terminal-green uppercase tracking-[0.2em]">Buffer unsynchronized</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10"
          >
            <h3 className="font-black text-[10px] text-white/20 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <Shield size={16} className="text-terminal-green" />
              Access_Control_List
            </h3>
            <ChmodPanel 
              file={file} 
              onUpdate={(updated) => setFile(updated)} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-10"
          >
            <h3 className="font-black text-[10px] text-white/20 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <Info size={16} className="text-terminal-green" />
              Object_Metadata
            </h3>
            <div className="space-y-8">
              <MetadataRow label="Owner Identity" value={file.owner?.username} />
              <MetadataRow label="Group Identity" value={file.group?.name} />
              <MetadataRow label="Creation Epoch" value={new Date(file.createdAt).toLocaleString()} />
              <MetadataRow label="Inode Pointer" value={file._id} mono />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MetadataRow = ({ label, value, mono }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">{label}</span>
    <span className={`text-xs text-white/60 ${mono ? 'font-mono truncate' : 'font-bold'}`}>{value}</span>
  </div>
);

export default FileDetails;
