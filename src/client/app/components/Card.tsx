import React from 'react';

interface Props {
  selectedCard: string |  null;
}

function Card(props: Props): React.ReactElement {
  const { selectedCard } = props;
  return (
    <div className="card">
      <p>{selectedCard}</p>
    </div>
  );
}

export default Card;
