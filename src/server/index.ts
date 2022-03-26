import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { SocketEvent } from '../commons/socket-event.enum';
import { User } from '../commons/models/user.model';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public', { index: false }));

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: process.cwd() });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(SocketEvent.CREATE_PLANNING, () => {
    socket.emit(SocketEvent.GET_CODE, uuidV4());
  });

  socket.on(SocketEvent.JOIN_PLANNING, async (data) => {
    socket.join(data.planning);

    const user: User = {
      id: socket.id,
      room: data.planning,
      displayName: data.displayName,
      selectedCard: null,
    };
    socket.data = { ...user };

    const roomSockets = await io.in(user.room).fetchSockets();
    const users = roomSockets.map((roomSocket) => roomSocket.data);

    io.to(data.planning).emit(SocketEvent.USER_JOIN, users);
  });

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

  socket.on('disconnect', async () => {
    console.log('user disconnected');
    // socket.leave()
    const roomSockets = await io.in(socket.data.room).fetchSockets();
    const users = roomSockets.map((roomSocket) => roomSocket.data);
    io.to(socket.data.room).emit(SocketEvent.USER_JOIN, users);
  });
});

server.listen(3000, () => console.log('server started.'));
