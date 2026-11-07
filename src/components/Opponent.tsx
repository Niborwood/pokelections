import { useQuery } from "@tanstack/react-query";
import { getPokemon } from "../api/pokemon";
import type { PokemonSpecies } from "../types";
import { getTranslatedPokemonName } from "../utils";
import { useContext } from "react";
import { AppContext } from "../App";

export const Opponent = () => {
  const { randomPokemonID, setCurrentPokemonName } = useContext(AppContext);
  const pokemonQuery = useQuery<PokemonSpecies>({
    queryKey: ["getPokemon", randomPokemonID],
    queryFn: async () => {
      const data = await getPokemon(randomPokemonID ?? 0);
      setCurrentPokemonName(getTranslatedPokemonName(data));
      return data;
    },
    enabled: randomPokemonID !== null,
  });
  const pokemon = pokemonQuery.data;

  return (
    <section className="">
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
        <div className="flex justify-between">
          <h3>{getTranslatedPokemonName(pokemon)}</h3>
          <img
            id={pokemon.name}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonID}.png`}
            alt={pokemon.name}
          />
        </div>
      )}
    </section>
  );
};
