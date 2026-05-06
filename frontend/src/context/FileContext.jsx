import { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const fetchFiles = useCallback(async (parentId = null) => {
    setLoading(true);
    try {
      const res = await api.get(`/files${parentId ? `?parent=${parentId}` : ''}`);
      setFiles(res.data);
      setCurrentFolder(parentId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFile = async (fileData) => {
    try {
      const res = await api.post('/files', { ...fileData, parent: currentFolder });
      setFiles(prev => [...prev, res.data]);
      toast.success('File created successfully');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create file');
      throw err;
    }
  };

  const updateFile = async (id, data) => {
    try {
      const res = await api.put(`/files/${id}`, data);
      setFiles(prev => prev.map(f => f._id === id ? res.data : f));
      toast.success('File updated');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Permission denied');
      throw err;
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(f => f._id !== id));
      toast.success('File deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Permission denied');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  return (
    <FileContext.Provider value={{ 
      files, currentFolder, loading, logs,
      fetchFiles, createFile, updateFile, deleteFile, fetchLogs 
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => useContext(FileContext);
