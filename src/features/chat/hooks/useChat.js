// fileName: src/hooks/useChat.js (VERSIÓN EDITADA)

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
import { useThemeContext } from '../../../context/ThemeContext'; // <-- 1. Importamos el contexto del tema

export const useChat = (userId, recipientUser) => {
  const { setThemeMode } = useThemeContext(); // <-- 2. Obtenemos la función para cambiar el tema
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const recipientId = recipientUser?._id;

  // --- NUEVA FUNCIÓN PARA ANALIZAR SENTIMIENTO Y CAMBIAR TEMA ---
  const analyzeAndSetTheme = useCallback(async (text) => {
    // Evita analizar mensajes muy cortos o vacíos
    if (!text || text.length < 5) return; 

    try {
      // 3. Llama a tu (futuro) servicio de IA en el backend
      // NOTA: Debes crear este endpoint en tu API de Node.js
      const response = await apiClient.post('/api/v1/ai/sentiment', { text });
      const mood = response.data.mood; // ej: "happy", "sad", "neutral"
      
      console.log(`IA detectó sentimiento: ${mood}`);

      // 4. Actualiza el tema de toda la aplicación
      setThemeMode(mood);

    } catch (error) {
      console.error("Error al analizar sentimiento:", error);
      // En caso de error, podríamos volver al tema neutral para seguridad
      setThemeMode('neutral');
    }
  }, [setThemeMode]);


  // --- LÓGICA DE WEBSOCKET (con integración de tema) ---
  useEffect(() => {
    if (!userId || !recipientId) return;
    // 1. OBTENER LA URL BASE DE LA API DESDE VARIABLES DE ENTORNO
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // 2. CONVERTIR HTTP A WEBSOCKET (ws/wss)
    const wsUrl = apiBaseUrl.replace(/^http/, 'ws');

    console.log('Intentando conectar WS a:', wsUrl); // Para depurar
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('✅ Conectado al WebSocket');
      ws.send(JSON.stringify({ type: 'init', userId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isRelevant = (data.remitenteId === userId && data.recipientId === recipientId) || (data.remitenteId === recipientId && data.recipientId === userId);
      
      if (isRelevant && data.remitenteId !== userId) {
        const newMessage = {
            ...data,
            text: data.text,
            timestamp: data.timestamp,
            date: new Date(data.timestamp).toLocaleDateString(),
            sender: data.remitenteId === userId ? 'user' : 'otro',
        };
        setMessages(prev => [...prev, newMessage]);
        
        // --> 5. Analiza el sentimiento del mensaje RECIBIDO (si no es nuestro)
        if (data.remitenteId !== userId) {
          analyzeAndSetTheme(data.text);
        }
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('❌ WebSocket cerrado');
    setSocket(ws);

    return () => ws.close();
  }, [userId, recipientId, analyzeAndSetTheme]); // <-- Se añade analyzeAndSetTheme a las dependencias


  // --- LÓGICA PARA OBTENER Y BORRAR HISTORIAL (sin cambios) ---
  const fetchChatHistory = useCallback(async () => {
    if (!userId || !recipientId) return;
    try {
      const response = await apiClient.get(`/api/v1/chat/history/${userId}/${recipientId}`);
      const formatted = response.data.mensajes.map(msg => ({
        ...msg,
        text: msg.texto,
        timestamp: msg.fecha,
        date: new Date(msg.fecha).toLocaleDateString(),
        sender: msg.remitenteId === userId ? 'user' : 'otro'
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([]);
    }
  }, [userId, recipientId]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const clearHistory = async () => { /* ... sin cambios ... */ };


// En src/hooks/useChat.js

const sendMessage = (text, userName) => {
  if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

  // 1. Prepara el objeto del nuevo mensaje localmente
  const newMessage = {
    remitenteId: userId,
    recipientId,
    remitenteNombre: userName,
    text,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    sender: 'user',
  };

  // 2. Envía el mensaje al servidor
  socket.send(JSON.stringify({ userId, recipientId, text, remitenteNombre: userName }));
  
  // 3. ACTUALIZACIÓN OPTIMISTA: Añade el mensaje al estado local INMEDIATAMENTE
  setMessages(prev => [...prev, newMessage]);

  // 4. Llama a la IA
  analyzeAndSetTheme(text);
};

  return { messages, sendMessage, clearHistory };
};

