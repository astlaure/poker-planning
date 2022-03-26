import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../commons/enums/socket-event.enum';
import { User } from '../../commons/models/user.model';

const cardEvents = (io: Server, socket: Socket) => {
  socket.on(SocketEvent.SELECT_CARD, (data) => {
    (socket.data as User).selectedCard = data.selectedCard;
    io.to(socket.data.room).emit(SocketEvent.SELECT_CARD, socket.data);
  });

  socket.on(SocketEvent.SHOW_CARDS, () => {
    io.to(socket.data.room).emit(SocketEvent.SHOW_CARDS);
  });

  socket.on(SocketEvent.RESET_CARDS, async () => {
    const roomSockets = await io.in(socket.data.room).fetchSockets();
    const users = roomSockets.map((roomSocket) => ({ ...roomSocket.data, selectedCard: null }));
    io.to(socket.data.room).emit(SocketEvent.RESET_CARDS, users);
  });
};

export default cardEvents;
