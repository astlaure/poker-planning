import { Server, Socket } from 'socket.io';

const getRoomUsers = async (io: Server, socket: Socket) => {
  const roomSockets = await io.in(socket.data.room).fetchSockets();
  return roomSockets.map((roomSocket) => roomSocket.data);
};

export default {
  getRoomUsers,
}
