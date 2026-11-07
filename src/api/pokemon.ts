import { POKELECTIONS_API_BASE, POKEMON_API_BASE } from "../constants/api";
import type { PokemonSpecies } from "../types";

export const getPokemon = async (id: number): Promise<PokemonSpecies> => {
  const res = await fetch(`${POKEMON_API_BASE}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Error getting Pokémon");
  return await res.json();
};

export const voteForPokemon = async (
  pokemonName: string,
  candidate: string,
) => {
  const res = await fetch(`${POKELECTIONS_API_BASE}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pokemonName, candidate }),
  });

  if (!res.ok) {
    throw new Error(`Failed to vote for Pokemon: ${res.statusText}`);
  }

  return await res.json();
};
