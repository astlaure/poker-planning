import React from 'react';
import Card from './Card';
import CardBack from './CardBack';

interface Props {
  displayName: string;
  selectedCard: string | null;
  cardRevealed: boolean;
}

function Player(props: Props): React.ReactElement {
  const { displayName, selectedCard, cardRevealed } = props;
  return (
    <div className="player">
      { cardRevealed ? <Card selectedCard={selectedCard} /> : <CardBack selectedCard={selectedCard} /> }
      <p className="display-name">{displayName}</p>
    </div>
  );
}

export default Player;
