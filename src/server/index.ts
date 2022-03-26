import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { SocketEvent } from '../commons/enums/socket-event.enum';
import planningEvents from './plannings/planning.events';
import cardEvents from './cards/card.events';
import userUtil from './users/user.util';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public', { index: false }));

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: process.cwd() });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  planningEvents(io, socket);

  cardEvents(io, socket);

  socket.on('disconnect', async () => {
    console.log('user disconnected');
    io.to(socket.data.room).emit(SocketEvent.USER_JOIN, await userUtil.getRoomUsers(io, socket));
  });
});

server.listen(3000, () => console.log('server started.'));
