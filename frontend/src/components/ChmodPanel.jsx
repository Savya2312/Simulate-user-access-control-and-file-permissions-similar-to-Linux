import { useState, useEffect } from 'react';
import { useFiles } from '../context/FileContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Info } from 'lucide-react';

const ChmodPanel = ({ file, onUpdate }) => {
  const { updateFile } = useFiles();
  const [perms, setPerms] = useState(file.permissions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPerms(file.permissions);
  }, [file.permissions]);

  const toggleBit = (index, char) => {
    const arr = perms.split('');
    arr[index] = arr[index] === char ? '-' : char;
    setPerms(arr.join(''));
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const updated = await updateFile(file._id, { permissions: perms });
      onUpdate(updated);
    } catch (err) {
      setPerms(file.permissions);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { label: 'Owner', start: 0, color: 'ubuntu-orange' },
    { label: 'Group', start: 3, color: 'ubuntu-purple' },
    { label: 'Others', start: 6, color: 'white/40' }
  ];

  const bits = [
    { label: 'Read', char: 'r', offset: 0, bitValue: 4 },
    { label: 'Write', char: 'w', offset: 1, bitValue: 2 },
    { label: 'Exec', char: 'x', offset: 2, bitValue: 1 }
  ];

  const calculateNumeric = (start) => {
    let n = 0;
    if (perms[start] === 'r') n += 4;
    if (perms[start+1] === 'w') n += 2;
    if (perms[start+2] === 'x') n += 1;
    return n;
  };

  return (
    <div className="space-y-8">
      {/* Visual Indicator */}
      <div className="relative group">
        <div className="absolute inset-0 bg-ubuntu-orange/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-terminal-black/80 rounded-2xl p-6 border border-white/10 flex items-center justify-between shadow-inner overflow-hidden">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Active String</span>
            <span className="font-mono text-3xl tracking-[0.3em] text-white font-black">{perms}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Numeric</span>
            <div className="flex gap-1 justify-end">
              {sections.map((s, i) => (
                <span key={i} className={`text-2xl font-black font-mono ${i === 2 ? 'text-white/40' : 'text-white'}`}>
                  {calculateNumeric(s.start)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => (
          <div key={section.label} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{section.label}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-white/20">VAL:</span>
                <span className="text-xs font-mono font-bold text-ubuntu-orange">{calculateNumeric(section.start)}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {bits.map((bit) => {
                const index = section.start + bit.offset;
                const isActive = perms[index] === bit.char;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={bit.label}
                    onClick={() => toggleBit(index, bit.char)}
                    className={`py-3.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isActive 
                        ? 'bg-ubuntu-orange border-ubuntu-orange text-white shadow-lg shadow-ubuntu-orange/20' 
                        : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tighter">{bit.label}</span>
                    <span className={`text-sm font-mono font-black ${isActive ? 'text-white' : 'text-white/10'}`}>
                      {isActive ? bit.char : '-'}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="pt-4 space-y-4">
        <motion.button 
          whileHover={perms !== file.permissions ? { scale: 1.02 } : {}}
          whileTap={perms !== file.permissions ? { scale: 0.98 } : {}}
          onClick={handleApply}
          disabled={loading || perms === file.permissions}
          className={`w-full py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 ${
            perms === file.permissions 
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
              : 'bg-gradient-to-r from-ubuntu-orange to-orange-600 text-white shadow-2xl shadow-ubuntu-orange/30'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              {perms === file.permissions ? <Shield size={18} /> : <Check size={18} />}
              {perms === file.permissions ? 'System Synchronized' : 'Commit Changes'}
            </>
          )}
        </motion.button>
        
        <AnimatePresence>
          {perms !== file.permissions && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 justify-center py-2 px-4 bg-ubuntu-orange/10 border border-ubuntu-orange/20 rounded-xl"
            >
              <Info size={12} className="text-ubuntu-orange" />
              <span className="text-[10px] font-bold text-ubuntu-orange uppercase tracking-widest">
                Staged: {perms}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChmodPanel;
