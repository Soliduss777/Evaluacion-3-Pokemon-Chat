import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Chat from "./Chat";

function PokemonCard({ pokemon }) {
  const [liked, setLiked] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`like-${pokemon.id}`);
    setLiked(saved === "true");
  }, [pokemon.id]);

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`like-${pokemon.id}`, newLiked);
  };

  return (
    <>
      <Card>
        <Card.Img variant="top" src={pokemon.image} />
        <Card.Body>
          <Card.Title>{pokemon.name}</Card.Title>
          <Button variant="outline-primary" onClick={() => setChatOpen(true)} className="me-2">
            💬 Hablemos
          </Button>
          <Button variant="outline-danger" onClick={toggleLike}>
            {liked ? "❤️" : "🤍"}
          </Button>
        </Card.Body>
      </Card>

      {chatOpen && (
        <Chat pokemon={pokemon} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
}

export default PokemonCard;