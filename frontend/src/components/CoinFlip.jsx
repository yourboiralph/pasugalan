import React, { useEffect, useState } from "react";
import Heads from "../assets/heads.png";
import Tails from "../assets/tails.png";
import "./CoinFlip.css";

const CoinFlip = ({ side }) => {
  const [rotation, setRotation] = useState(0);
  const [currentSide, setCurrentSide] = useState(side);

  useEffect(() => {
    // Always trigger flip animation, even on mount
    setRotation((prev) => prev + 1440);

    // Delay the switch of the image to halfway through the flip
    const timer = setTimeout(() => {
      setCurrentSide(side);
    }, 1000);

    return () => clearTimeout(timer);
  }, [side]);

  return (
    <div className="coin-container">
      <div className="coin" style={{ transform: `rotateY(${rotation}deg)` }}>
        <div className="face front">
          <img src={currentSide === "head" ? Heads : Tails} alt={currentSide} />
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
