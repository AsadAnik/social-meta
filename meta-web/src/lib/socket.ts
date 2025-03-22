import { io } from 'socket.io-client';

// Initialize WebSocket Connection
export const socket = io("http://localhost:8080", {
  withCredentials: true, // Allow credentials
  transports: ["websocket", "polling"],
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('connect_error', (err) => {
  console.error('WebSocket Connection Error:', err.message);
});

// Handle CORS-related errors
socket.io.on("error", (error) => {
  console.error("Socket.IO Error:", error);
});

// Example of listening for "postLiked" event
socket.on('postLiked', (data) => {
  console.log('Post liked:', data);
  // Handle UI update when a post is liked
});
