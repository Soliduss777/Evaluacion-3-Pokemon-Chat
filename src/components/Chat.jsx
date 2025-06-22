import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function Chat({ pokemon, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const promptBase = `
Eres el Pokémon ${pokemon.name}. 
Tus habilidades son: ${pokemon.abilities.join(", ")}. 
Tus movimientos son: ${pokemon.moves.slice(0, 5).join(", ")}.
Tus estadísticas son: ${pokemon.stats.map((s) => `${s.name}: ${s.value}`).join(", ")}.
Responde en primera persona como si fueras el Pokémon.
`;

  const sendMessage = async () => {
    const userPrompt = `${promptBase}\nUsuario pregunta: ${input}`;
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        }),
      }
    );
    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No entendí eso.";

    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: reply }]);
    setInput("");
  };

  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chat con {pokemon.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <p key={i}>
              <strong>{msg.role === "user" ? "Tú" : pokemon.name}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <Form.Control
          className="mt-3"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button onClick={sendMessage} disabled={!input}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Chat;