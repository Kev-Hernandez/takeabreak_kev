import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const ChatHistory = ({ messages }) => {
  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.date]) grouped[msg.date] = [];
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Historial de Mensajes
      </Typography>
      {Object.keys(groupedMessages).length === 0 ? (
        <Typography variant="body2">No hay mensajes en el historial.</Typography>
      ) : (
        Object.entries(groupedMessages).map(([date, msgs]) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{date}</Typography>
            <List dense>
              {msgs.map((msg, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={`${msg.sender || 'otro'}: ${msg.text}`} 
                    secondary={msg.timestamp}
                    primaryTypographyProps={{ fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChatHistory;