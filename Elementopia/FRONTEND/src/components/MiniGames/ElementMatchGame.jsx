import React, { useState, useEffect } from "react";
import "../../assets/css/ElementMatchGame.css";

const elements = [
  { name: "Hydrogen", symbol: "H" },
  { name: "Oxygen", symbol: "O" },
  { name: "Carbon", symbol: "C" },
  { name: "Nitrogen", symbol: "N" },
  // Add more if needed
];

// useEffect to fetch daily game



const shuffleCards = () => {
  const cards = [];
  elements.forEach((el) => {
    cards.push({ type: "name", value: el.name });
    cards.push({ type: "symbol", value: el.symbol });
  });
  return cards.sort(() => 0.5 - Math.random());
};

const ElementMatchGame = () => {
  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;

      const firstEl = elements.find(
        (el) => el.name === first.value || el.symbol === first.value
      );
      const secondEl = elements.find(
        (el) => el.name === second.value || el.symbol === second.value
      );

      const isMatch =
        firstEl &&
        secondEl &&
        ((firstEl.name === first.value && firstEl.symbol === second.value) ||
          (firstEl.symbol === first.value && firstEl.name === second.value));

      if (isMatch) {
        setMatched((prev) => [...prev, first.value, second.value]);
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped]);

  const handleClick = (card, index) => {
    if (
      flipped.length < 2 &&
      !flipped.some((f) => f.index === index) &&
      !matched.includes(card.value)
    ) {
      setFlipped((prev) => [...prev, { ...card, index }]);
    }
  };

  const restartGame = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
  };

  return (
    <div className="game-container">
      <button className="restart-button" onClick={restartGame}>
        Restart Game
      </button>
      <div className="cards-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.some((f) => f.index === index);
          const isMatched = matched.includes(card.value);

          return (
            <div
              key={index}
              className={`card ${isFlipped || isMatched ? "flipped" : ""}`}
              onClick={() => handleClick(card, index)}
            >
              {isFlipped || isMatched ? card.value : "?"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementMatchGame;
