// fileName: src/hooks/useChat.js

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient'; // <-- Asegúrate de que esta ruta a tu apiClient sea correcta

export const useChat = (userId, recipientUser) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const recipientId = recipientUser?._id;

  // --- LÓGICA DE WEBSOCKET ---
  useEffect(() => {
    if (!userId || !recipientId) return;

    const ws = new WebSocket('ws://localhost:3001'); // Considera mover la URL a .env

    ws.onopen = () => {
      console.log('✅ Conectado al WebSocket');
      ws.send(JSON.stringify({ type: 'init', userId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isRelevant = 
        (data.remitenteId === userId && data.recipientId === recipientId) ||
        (data.remitenteId === recipientId && data.recipientId === userId);

      if (isRelevant) {
        const newMessage = {
          ...data,
          text: data.text,
          timestamp: data.timestamp,
          date: new Date(data.timestamp).toLocaleDateString(),
          sender: data.remitenteId === userId ? 'user' : 'otro',
        };
        setMessages(prev => [...prev, newMessage]);
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('❌ WebSocket cerrado');
    setSocket(ws);

    return () => ws.close();
  }, [userId, recipientId]);


  // --- LÓGICA PARA OBTENER Y BORRAR HISTORIAL ---
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

  const clearHistory = async () => {
    if (!userId || !recipientId) return;
    try {
      await apiClient.delete(`/api/v1/chat/history/${userId}/${recipientId}`);
      setMessages([]);
    } catch (error) {
      console.error('Error al borrar el historial:', error);
    }
  };


  // --- FUNCIÓN PARA ENVIAR MENSAJES ---
  const sendMessage = (text, userName) => {
    if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ userId, recipientId, text, remitenteNombre: userName }));
  };

  return { messages, sendMessage, clearHistory };
};