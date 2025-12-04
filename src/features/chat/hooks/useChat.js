// src/features/chat/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
import { useThemeContext } from '../../../context/ThemeContext';

export const useChat = (userId, selectedUser) => {
  // Traemos el setter para actualizar la Sidebar al instante
  const { setThemeMode } = useThemeContext(); 
  
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  const recipientId = selectedUser?._id || selectedUser?.id;

  // --- 1. FUNCIÓN QUE ACTUALIZA TU VIBE AL INSTANTE ---
  const analyzeAndSetTheme = useCallback(async (text) => {
    if (!text || text.length < 2) return; 

    try {
      // A) Pedimos la emoción a la IA
      const response = await apiClient.post('/api/v1/ai/sentiment', { text });
      const mood = response.data.mood; // ej: "felicidad"
      
      console.log(`IA detectó: ${mood}`);

      // B) ¡AQUÍ ESTÁ LA SOLUCIÓN!
      // Forzamos la actualización de la Sidebar inmediatamente
      if (mood) {
        setThemeMode(mood);
      }

      // C) Actualizamos también el mensaje en la lista local para que el fondo del chat cambie
      setMessages(prev => {
        const nuevos = [...prev];
        const index = nuevos.findIndex(m => m.sender === 'user' && m.text === text && !m.emocion);
        
        if (index !== -1) {
            nuevos[index] = { ...nuevos[index], emocion: mood };
        }
        return nuevos;
      });

    } catch (error) {
      console.error("Error analizando sentimiento:", error);
    }
  }, [setThemeMode]);


  // --- 2. WEBSOCKET (Recibir mensajes) ---
  useEffect(() => {
    if (!userId || !recipientId) return;
    
    let apiBaseUrl = apiClient.defaults.baseURL || 'http://localhost:4000';
    if (apiBaseUrl.startsWith('/')) apiBaseUrl = window.location.origin + apiBaseUrl; 
    const wsUrl = apiBaseUrl.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');

    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'init', userId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isRelevant = 
            (data.remitenteId === userId && data.recipientId === recipientId) || 
            (data.remitenteId === recipientId && data.recipientId === userId);
        
        if (isRelevant && data.remitenteId !== userId) {
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

    ws.onerror = (err) => console.error('WebSocket error:', err);
    setSocket(ws);

    return () => ws.close();
  }, [userId, recipientId]);


  // --- 3. CARGAR HISTORIAL ---
  const fetchMessages = useCallback(async () => {
    if (!userId || !recipientId) return;
    try {
      const response = await apiClient.get(`/api/v1/chat/history/${userId}/${recipientId}`);
      const formatted = response.data.mensajes.map(msg => ({
        ...msg,
        text: msg.texto,
        timestamp: msg.fecha,
        // Identificación robusta del sender
        sender: (msg.remitenteId === userId || msg.remitenteId?._id === userId) ? 'user' : 'otro',
        emocion: msg.emocion 
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Error historial:', error);
      setMessages([]);
    }
  }, [userId, recipientId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const clearHistory = async () => {
      if (!userId || !recipientId) return;
      try {
          await apiClient.delete(`/api/v1/chat/history/${userId}/${recipientId}`);
          setMessages([]);
      } catch (e) { console.error(e); }
  };

  // --- 4. ENVIAR MENSAJE ---
  const sendMessage = async (text, userName) => {
    if (!text.trim()) return;

    // Agregamos mensaje local (sin emoción aún)
    const newMessage = {
      remitenteId: userId,
      recipientId,
      remitenteNombre: userName,
      text,
      timestamp: new Date().toISOString(),
      sender: 'user',
      emocion: null 
    };
    
    setMessages(prev => [...prev, newMessage]);

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ userId, recipientId, text, remitenteNombre: userName }));
    }

    // Llamamos a la función que SÍ actualiza la UI al terminar
    await analyzeAndSetTheme(text);
  };

  return {
    messages,
    sendMessage,
    clearHistory,
    refreshMessages: fetchMessages
  };
};