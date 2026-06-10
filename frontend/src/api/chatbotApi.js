import API from '../services/axios';

export const sendMessageToBot = async (message) => {
  const response = await API.post('/chatbot/chat', {
    message,
  });

  return response.data;
};

export const getChatbotStatus = async () => {
  const response = await API.get('/chatbot/status');
  return response.data;
};