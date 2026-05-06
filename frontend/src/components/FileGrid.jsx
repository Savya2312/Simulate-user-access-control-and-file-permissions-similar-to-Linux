import { useNavigate } from 'react-router-dom';
import { File, Folder, MoreVertical, Shield, User, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FileGrid = ({ files, loading, viewMode }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card-ubuntu p-8 animate-pulse h-32 bg-white/5"></div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-20 text-center border-dashed border-2 border-white/5"
      >
        <div className="w-20 h-20 bg-ubuntu-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Folder size={40} className="text-ubuntu-purple/40" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No data found</h3>
        <p className="text-white/40 text-sm max-w-xs mx-auto">
          The virtual file system is currently empty. Initialize it by creating your first object.
        </p>
      </motion.div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="card-ubuntu bg-white/5 border-white/10">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Name</th>
              <th className="px-6 py-4">Permissions</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {files.map((file) => (
              <tr 
                key={file._id} 
                onClick={() => navigate(`/files/${file._id}`)}
                className="table-row-hover group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${file.type === 'folder' ? 'bg-ubuntu-purple/20 text-ubuntu-purple' : 'bg-terminal-black text-white/60'}`}>
                      {file.type === 'folder' ? <Folder size={18} /> : <File size={18} />}
                    </div>
                    <span className="font-bold text-sm text-white group-hover:text-ubuntu-orange transition-colors">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <code className="text-[10px] font-mono bg-terminal-black px-2 py-1 rounded text-terminal-green border border-white/5">
                      {file.permissions}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <User size={14} className="text-ubuntu-orange" />
                    {file.owner?.username}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs text-white/30 font-mono">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <ChevronRight size={18} className="ml-auto text-white/10 group-hover:text-ubuntu-orange group-hover:translate-x-1 transition-all" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {files.map((file, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          key={file._id}
          onClick={() => navigate(`/files/${file._id}`)}
          className="card-ubuntu group p-0 relative"
        >
          <div className={`absolute top-0 left-0 w-1.5 h-full ${file.type === 'folder' ? 'bg-ubuntu-purple' : 'bg-ubuntu-orange'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 rounded-2xl ${file.type === 'folder' ? 'bg-ubuntu-purple/20 text-ubuntu-purple' : 'bg-terminal-black/50 text-white/80'} shadow-inner`}>
                {file.type === 'folder' ? <Folder size={32} /> : <File size={32} />}
              </div>
              <div className="flex flex-col items-end gap-1">
                <code className="text-[10px] font-mono font-black text-terminal-green bg-black/40 px-2 py-0.5 rounded border border-white/5">
                  {file.permissions}
                </code>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                  {symbolicToNumeric(file.permissions)}
                </span>
              </div>
            </div>

            <h4 className="text-lg font-black text-white mb-2 truncate group-hover:text-ubuntu-orange transition-colors">
              {file.name}
            </h4>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-ubuntu-purple/30 flex items-center justify-center text-[10px] font-bold text-white">
                  {file.owner?.username?.[0].toUpperCase()}
                </div>
                <span className="text-[10px] font-bold text-white/40">{file.owner?.username}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-mono">
                <Clock size={12} />
                {new Date(file.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const symbolicToNumeric = (sym) => {
  const sliceToNum = (slice) => {
    let n = 0;
    if (slice[0] === 'r') n += 4;
    if (slice[1] === 'w') n += 2;
    if (slice[2] === 'x') n += 1;
    return n;
  };
  return `${sliceToNum(sym.substring(0, 3))}${sliceToNum(sym.substring(3, 6))}${sliceToNum(sym.substring(6, 9))}`;
};

export default FileGrid;
