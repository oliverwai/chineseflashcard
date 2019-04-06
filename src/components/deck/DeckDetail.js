import React from "react";

// replace this w/ flashcard info
const DeckDetails = props => {
  const id = props.match.params.id;
  return (
    <div className="container section deck-details">
      <div className="card z-depth-0">
        <div className="card-content">
          <span className="card-title">Deck Title - {id}</span>
          <p>lorem</p>
        </div>
        <div className="card-action gret ligthen-4 grey-text">
          <div>Posted by Oli</div>
          <div>Sept 2, 2am</div>
        </div>
      </div>
    </div>
  );
};

export default DeckDetails;
