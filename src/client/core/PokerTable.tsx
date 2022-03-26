import React, { useContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import ProfileContext from '../contexts/ProfileContext';
import { SocketEvent } from '../../commons/enums/socket-event.enum';
import { User } from '../../commons/models/user.model';

const fibonacci = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?'];

function PokerTable(): React.ReactElement {
  const socket = useSocket();

  const { profile } = useContext(ProfileContext);
  const [state, setState] = useState<User[]>([]);
  const [isRevealed, setRevealed] = useState(false);

  useEffect(() => {
    socket.on(SocketEvent.USER_JOIN, (data) => setState(data));

    socket.on(SocketEvent.SELECT_CARD, (user: User) => {
      // To use the current state always use the callback version
      setState((prevState) => prevState.map((element) => {
        if (element.id === user.id) {
          return user;
        }
        return element;
      }));
    });

    socket.on(SocketEvent.SHOW_CARDS, () => setRevealed(true));
    socket.on(SocketEvent.RESET_CARDS, (data) => {
      setRevealed(false);
      setState(data);
    });
  }, []);

  const handleCardClick = (value: string) => {
    if (isRevealed) { return; }
    socket.emit(SocketEvent.SELECT_CARD, { planning: profile.planning, displayName: profile.displayName, selectedCard: value });
  };

  return (
    <div>
      <h1>PokerTable</h1>
      <p>Planning: {profile.planning}</p>
      <p>Display Name: {profile.displayName}</p>

      <div className="poker-section">
        <div className="users-list">
          <ul>
            { state.map((user: any) => {
              return <li key={user.id}>{user.displayName} {isRevealed ? user.selectedCard : '?'}</li>;
            }) }
          </ul>
        </div>
        <div className="table">
          {
            isRevealed
            ? <button onClick={() => socket.emit(SocketEvent.RESET_CARDS, profile.planning)}>Reset Cards</button>
            : <button onClick={() => socket.emit(SocketEvent.SHOW_CARDS, profile.planning)}>Reveal Cards</button>
          }
        </div>
      </div>

      <div className="cards-section">
        { fibonacci.map((number) => <button key={number} onClick={() => { handleCardClick(number); }}>{number}</button>) }
      </div>
    </div>
  );
}

export default PokerTable;
