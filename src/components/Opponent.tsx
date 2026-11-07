import { useQuery } from "@tanstack/react-query";
import { getPokemon } from "../api/pokemon";
import type { PokemonSpecies } from "../types";
import { getTranslatedPokemonName } from "../utils";
import { useContext } from "react";
import { AppContext } from "../App";

export const Opponent = () => {
  const { randomPokemonID } = useContext(AppContext);
  const pokemonQuery = useQuery<PokemonSpecies>({
    queryKey: ["getPokemon", randomPokemonID],
    queryFn: async () => await getPokemon(randomPokemonID ?? 0),
    enabled: randomPokemonID !== null,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  const pokemon = pokemonQuery.data;

  return (
    <div>
      <section>
        {pokemonQuery.isLoading && <p>Loading...</p>}
        {pokemonQuery.isError && (
          <p>
            Error:{" "}
            {pokemonQuery.error instanceof Error
              ? pokemonQuery.error.message
              : "Unknown error"}
          </p>
        )}
        {pokemon && (
          <div>
            <h3>{getTranslatedPokemonName(pokemon)}</h3>
            <img
              id={pokemon.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonID}.png`}
              alt={pokemon.name}
            />
          </div>
        )}
      </section>
    </div>
  );
};
