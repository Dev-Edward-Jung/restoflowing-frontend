import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

let stompClient: CompatClient | null = null;

export const connectWebSocket = (
  roomId: string,
  onMessage: (msg: any) => void
) => {
  const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws-chat`);
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log('WebSocket connected');

    // 메시지 수신
    stompClient?.subscribe(`/topic/chat/${roomId}`, (message) => {
      onMessage(JSON.parse(message.body));
    });

    // (선택) 입장 메시지 보내기
    stompClient?.send('/app/sendMessage', {}, JSON.stringify({
      roomId,
      senderId: 'user123',
      message: 'JOIN',
      type: 'JOIN'
    }));
  });
};

export const sendMessage = (roomId: string, senderId: string, message: string) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/sendMessage', {}, JSON.stringify({
      roomId,
      senderId,
      message,
      type: 'CHAT'
    }));
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log('WebSocket disconnected');
    });
  }
};