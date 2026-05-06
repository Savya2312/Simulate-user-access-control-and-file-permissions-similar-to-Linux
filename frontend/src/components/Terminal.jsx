import { useState, useRef, useEffect } from 'react';
import { useFiles } from '../context/FileContext';
import { useAuth } from '../context/AuthContext';
import { Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'info', text: 'Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-40-generic x86_64)' },
    { type: 'info', text: '* Documentation:  https://help.ubuntu.com' },
    { type: 'info', text: 'Welcome to the LinuxSim Virtual Terminal.' },
    { type: 'info', text: 'Type "help" for a list of available commands.' },
    { type: 'info', text: '' },
  ]);
  const { files, updateFile, fetchFiles, createFile } = useFiles();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;

      setHistory(prev => [...prev, { type: 'command', text: cmd }]);
      setInput('');

      const args = cmd.split(' ').filter(arg => arg !== '');
      const action = args[0].toLowerCase();

      switch (action) {
        case 'help':
          setHistory(prev => [...prev, { type: 'info', text: 'Available commands: ls, chmod, touch, mkdir, cat, clear, whoami, pwd, help, date, uname' }]);
          break;
        case 'ls':
          const fileList = files.map(f => `${f.permissions}  ${f.owner?.username || 'root'}  ${f.name}`).join('\n');
          setHistory(prev => [...prev, { type: 'output', text: fileList || 'total 0' }]);
          break;
        case 'cat':
          if (!args[1]) {
            setHistory(prev => [...prev, { type: 'error', text: 'cat: missing operand' }]);
          } else {
            const file = files.find(f => f.name === args[1]);
            if (!file) {
              setHistory(prev => [...prev, { type: 'error', text: `cat: ${args[1]}: No such file or directory` }]);
            } else if (file.type === 'folder') {
              setHistory(prev => [...prev, { type: 'error', text: `cat: ${args[1]}: Is a directory` }]);
            } else {
              setHistory(prev => [...prev, { type: 'output', text: file.content || '' }]);
            }
          }
          break;
        case 'touch':
          if (!args[1]) {
            setHistory(prev => [...prev, { type: 'error', text: 'touch: missing file operand' }]);
          } else {
            try {
              await createFile({ name: args[1], type: 'file' });
              setHistory(prev => [...prev, { type: 'success', text: `Created file '${args[1]}'` }]);
              fetchFiles();
            } catch (err) {
              setHistory(prev => [...prev, { type: 'error', text: `touch: ${err.response?.data?.message || err.message}` }]);
            }
          }
          break;
        case 'mkdir':
          if (!args[1]) {
            setHistory(prev => [...prev, { type: 'error', text: 'mkdir: missing operand' }]);
          } else {
            try {
              await createFile({ name: args[1], type: 'folder' });
              setHistory(prev => [...prev, { type: 'success', text: `Created directory '${args[1]}'` }]);
              fetchFiles();
            } catch (err) {
              setHistory(prev => [...prev, { type: 'error', text: `mkdir: ${err.response?.data?.message || err.message}` }]);
            }
          }
          break;
        case 'whoami':
          setHistory(prev => [...prev, { type: 'output', text: user?.username }]);
          break;
        case 'pwd':
          setHistory(prev => [...prev, { type: 'output', text: '/home/' + user?.username }]);
          break;
        case 'date':
          setHistory(prev => [...prev, { type: 'output', text: new Date().toString() }]);
          break;
        case 'uname':
          setHistory(prev => [...prev, { type: 'output', text: 'Linux simulator 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux' }]);
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'chmod':
          if (args.length < 3) {
            setHistory(prev => [...prev, { type: 'error', text: 'chmod: missing operand after ‘' + (args[1] || '') + '’' }]);
          } else {
            const mode = args[1];
            const filename = args[2];
            const file = files.find(f => f.name === filename);
            
            if (!file) {
              setHistory(prev => [...prev, { type: 'error', text: `chmod: cannot access '${filename}': No such file or directory` }]);
            } else {
              try {
                if (/^\d{3}$/.test(mode)) {
                  await updateFile(file._id, { numericPermissions: mode });
                } else if (/^([r-][w-][x-]){3}$/.test(mode)) {
                  await updateFile(file._id, { permissions: mode });
                } else {
                  throw new Error('invalid mode: ‘' + mode + '’');
                }
                setHistory(prev => [...prev, { type: 'success', text: `mode of '${filename}' changed to ${mode}` }]);
                fetchFiles();
              } catch (err) {
                setHistory(prev => [...prev, { type: 'error', text: `chmod: ${err.response?.data?.message || err.message}` }]);
              }
            }
          }
          break;
        default:
          setHistory(prev => [...prev, { type: 'error', text: `${action}: command not found` }]);
      }
    }
  };

  return (
    <div 
      className="flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-terminal-black shadow-black/50 h-[500px]"
      onClick={handleTerminalClick}
    >
      {/* Header */}
      <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border border-white/5">
            <TerminalIcon size={12} className="text-white/40" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
              bash — simulator
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/20">
          <Minimize2 size={14} />
          <Maximize2 size={14} />
        </div>
      </div>

      {/* Terminal Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-sm space-y-1.5 scroll-smooth"
      >
        {history.map((line, i) => (
          <div key={i} className="flex gap-3 leading-relaxed animate-fade-in">
            {line.type === 'command' && (
              <span className="text-terminal-green font-bold shrink-0 opacity-60">
                {user?.username}@sim:~$
              </span>
            )}
            <pre className={`whitespace-pre-wrap break-all ${
              line.type === 'error' ? 'text-red-400 font-bold' : 
              line.type === 'success' ? 'text-terminal-green' : 
              line.type === 'command' ? 'text-white' : 
              line.type === 'output' ? 'text-terminal-white' : 'text-white/30 italic'
            }`}>
              {line.text}
            </pre>
          </div>
        ))}

        {/* Current Input Line - Always Visible at the end of scrolling */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-terminal-green font-bold shrink-0 opacity-60">
            {user?.username}@sim:~$
          </span>
          <div className="relative flex-1">
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              spellCheck="false"
              autoComplete="off"
              className="bg-transparent border-none outline-none w-full text-white caret-transparent"
            />
            {/* Blinking Cursor Simulation */}
            <div 
              className="absolute left-0 top-0 h-5 w-2 bg-terminal-green/80 animate-blink pointer-events-none"
              style={{ transform: `translateX(${input.length}ch)` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/20 border-t border-white/5 px-6 py-2 flex items-center justify-between shrink-0">
        <span className="text-[9px] text-white/10 uppercase tracking-widest font-black">
          System_Kernel: 6.8.0-40-generic
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse"></div>
          <span className="text-[9px] text-terminal-green/40 uppercase font-black">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
