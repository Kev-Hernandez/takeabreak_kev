import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
// 1. IMPORTAMOS EL CONTEXTO DEL CHAT
import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext';

export const useChat = (userId, selectedUser) => {
  const { setThemeMode } = useThemeContext();
  
  // 2. TRAEMOS LA FUNCIÓN PARA GUARDAR VIBES
  const { updateUserVibe } = useChatContext(); 

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  const recipientId = selectedUser?._id || selectedUser?.id;

  const analyzeAndSetTheme = useCallback(async (text) => {
    if (!text || text.length < 2) return; 
    try {
      const response = await apiClient.post('/api/v1/ai/sentiment', { text });
      const mood = response.data.mood; 
      
      if (mood) setThemeMode(mood); // Tu sidebar

      setMessages(prev => {
        const nuevos = [...prev];
        const index = nuevos.findIndex(m => m.sender === 'user' && m.text === text && !m.emocion);
        if (index !== -1) {
            nuevos[index] = { ...nuevos[index], emocion: mood };
        }
        return nuevos;
      });

    } catch (error) { console.error(error); }
  }, [setThemeMode]);

  // --- WEBSOCKET ---
  useEffect(() => {
    if (!userId || !recipientId) return;
    
    let apiBaseUrl = apiClient.defaults.baseURL || 'http://localhost:4000';
    if (apiBaseUrl.startsWith('/')) apiBaseUrl = window.location.origin + apiBaseUrl; 
    const wsUrl = apiBaseUrl.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => ws.send(JSON.stringify({ type: 'init', userId }));

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isRelevant = 
            (data.remitenteId === userId && data.recipientId === recipientId) || 
            (data.remitenteId === recipientId && data.recipientId === userId);
        
        // Si llega un mensaje de mi amigo...
        if (isRelevant && data.remitenteId !== userId) {
          // ... ACTUALIZAMOS SU VIBE EN LA LISTA GLOBAL
          if (data.emocion) {
             updateUserVibe(data.remitenteId, data.emocion);
          }

          const newMessage = {
              ...data,
              text: data.text,
              timestamp: data.timestamp || new Date().toISOString(),
              sender: 'otro',
              emocion: data.emocion 
          };
          setMessages(prev => [...prev, newMessage]);
        }
      } catch (e) { console.error("Error WS:", e); }
    };
    setSocket(ws);
    return () => ws.close();
  }, [userId, recipientId, updateUserVibe]); // Agregamos updateUserVibe a deps


  // --- CARGAR HISTORIAL ---
  const fetchMessages = useCallback(async () => {
    if (!userId || !recipientId) return;
    try {
      const response = await apiClient.get(`/api/v1/chat/history/${userId}/${recipientId}`);
      
      const formatted = response.data.mensajes.map(msg => ({
        ...msg,
        text: msg.texto,
        timestamp: msg.fecha,
        sender: (msg.remitenteId === userId || msg.remitenteId?._id === userId) ? 'user' : 'otro',
        emocion: msg.emocion 
      }));
      setMessages(formatted);

      // --- AQUÍ ESTÁ EL TRUCO ---
      // Buscamos el último mensaje DE MI AMIGO en el historial
      const ultimoAmigo = [...formatted].reverse().find(m => m.sender === 'otro' && m.emocion);
      
      // Si encontramos uno, actualizamos su bolita en la lista de contactos
      if (ultimoAmigo) {
          updateUserVibe(recipientId, ultimoAmigo.emocion);
      }

    } catch (error) {
      console.error('Error historial:', error);
      setMessages([]);
    }
  }, [userId, recipientId, updateUserVibe]); // Agregamos updateUserVibe a deps

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const clearHistory = async () => {
      if (!userId || !recipientId) return;
      try { await apiClient.delete(`/api/v1/chat/history/${userId}/${recipientId}`); setMessages([]); } 
      catch (e) { console.error(e); }
  };

  const sendMessage = async (text, userName) => {
    if (!text.trim()) return;
    const newMessage = { remitenteId: userId, recipientId, remitenteNombre: userName, text, timestamp: new Date().toISOString(), sender: 'user', emocion: null };
    setMessages(prev => [...prev, newMessage]);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ userId, recipientId, text, remitenteNombre: userName }));
    }
    await analyzeAndSetTheme(text);
  };

  return { messages, sendMessage, clearHistory, refreshMessages: fetchMessages };
};