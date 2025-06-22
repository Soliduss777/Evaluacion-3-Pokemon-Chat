import React, { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const fetchAllPokemon = async () => {
      let all = [];
      let url = "https://pokeapi.co/api/v2/pokemon?limit=10000";
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results;

      const promises = results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()));
      const details = await Promise.all(promises);
      all = details.map((poke) => ({
        id: poke.id,
        name: poke.name,
        image: poke.sprites.front_default,
        url: poke.url,
        abilities: poke.abilities.map((a) => a.ability.name),
        stats: poke.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
        moves: poke.moves.map((m) => m.move.name),
      }));
      setPokemons(all);
    };
    fetchAllPokemon();
  }, []);

  const filtered = pokemons
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <Container>
      <h1 className="text-center my-4">Pokédex Chat</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar Pokémon por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Orden Ascendente</option>
            <option value="desc">Orden Descendente</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filtered.map((pokemon) => (
          <Col key={pokemon.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <PokemonCard pokemon={pokemon} />
          </Col>
        ))}
      </Row>
    </Container>
  );
  
  
}

export default App;
