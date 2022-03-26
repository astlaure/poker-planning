import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../commons/enums/socket-event.enum';
import { v4 as uuidV4 } from 'uuid';
import userUtil from '../users/user.util';
import { JoinPlanningDto } from './models/join-planning.dto';

const planningEvents = (io: Server, socket: Socket) => {
  socket.on(SocketEvent.CREATE_PLANNING, () => {
    socket.emit(SocketEvent.GET_CODE, uuidV4());
  });

  socket.on(SocketEvent.JOIN_PLANNING, async (data: JoinPlanningDto) => {
    socket.join(data.planning);

    // TODO type to user
    socket.data = {
      id: socket.id,
      room: data.planning,
      displayName: data.displayName,
      selectedCard: null,
    };

    io.to(data.planning).emit(SocketEvent.USER_JOIN, await userUtil.getRoomUsers(io, socket));
  });
};

export default planningEvents;
