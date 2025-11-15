let wsService = null;

export const initWebSocketService = (io) => {
  wsService = {
    sendToUser: (userId, payload) => {
      io.to(userId.toString()).emit("notification", payload);
    },
  };
};

export const getWebSocketService = () => {
  if (!wsService) {
    throw new Error("WebSocket service not initialized");
  }
  return wsService;
};
