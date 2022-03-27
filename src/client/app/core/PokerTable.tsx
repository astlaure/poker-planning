import React, { useContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import ProfileContext from '../contexts/ProfileContext';
import { SocketEvent } from '../../../commons/enums/socket-event.enum';
import { User } from '../../../commons/models/user.model';
import Player from '../components/Player';
import classNames from 'classnames';

const fibonacci = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?'];

function PokerTable(): React.ReactElement {
  const socket = useSocket();

  const { profile } = useContext(ProfileContext);
  const [state, setState] = useState<User[]>([]);
  const [isRevealed, setRevealed] = useState(false);
  const [currentCard, setCurrentCard] = useState<string|null>(null);

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
      setCurrentCard(null);
      setState(data);
    });
  }, []);

  const handleCardClick = (value: string) => {
    if (isRevealed) { return; }
    setCurrentCard(value);
    socket.emit(SocketEvent.SELECT_CARD, { planning: profile.planning, displayName: profile.displayName, selectedCard: value });
  };

  return (
    <div className="container poker-table-page">
      <h1>PokerTable</h1>
      <p>Planning: {profile.planning}</p>
      <p>Display Name: {profile.displayName}</p>

      <div className="poker-section">
        <div className="row">
          { state.map((user: User) => {
            return (
              <div key={user.id} className="column small-4 medium-2">
                <Player displayName={user.displayName} selectedCard={user.selectedCard} cardRevealed={isRevealed} />
              </div>
            )
          }) }
        </div>

        <div className="planning-controls">
          {
            isRevealed
            ? <button onClick={() => socket.emit(SocketEvent.RESET_CARDS, profile.planning)}>Reset Cards</button>
            : <button onClick={() => socket.emit(SocketEvent.SHOW_CARDS, profile.planning)}>Reveal Cards</button>
          }
        </div>
      </div>

      <div className="fibonacci-cards">
        <div className="row justify-center">
          { fibonacci.map((number) => (
            <div className="column medium-1">
              <button className={classNames({ 'selected': currentCard === number })} key={number} onClick={() => { handleCardClick(number); }}>{number}</button>
            </div>
          )) }
        </div>
      </div>
    </div>
  );
}

export default PokerTable;
