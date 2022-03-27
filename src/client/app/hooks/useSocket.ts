import io from 'socket.io-client';

const socket = io();

export default function useSocket() {
  return socket;
}
