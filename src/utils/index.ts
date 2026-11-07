import { SPRITE_URL } from "../constants/api";
import type { Candidate } from "../../lambdas/constants/candidates";
import { candidateToBall } from "../constants/candidateToBall";
import type { PokemonSpecies } from "../types";

const MAX_POKEMON_ID = 1025; // Maximum Pokemon ID in the PokeAPI

export const getRandomPokemonID = (): number => {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1; // Random ID between 1 and MAX_POKEMON_ID
};

export const getCandidateBall = (candidate: Candidate) => {
  const ballName = candidateToBall[candidate];
  if (!ballName) {
    throw new Error(`No ball found for candidate: ${candidate}`);
  }
  return `${SPRITE_URL}${ballName}.png`;
};

export const getTranslatedPokemonName = (
  pokemonData: PokemonSpecies,
  language: string = "fr",
): string => {
  const translatedName = pokemonData.names.find(
    (name: any) => name.language.name === language,
  );
  const rawName = translatedName ? translatedName.name : pokemonData.name;
  return rawName.toLocaleLowerCase("fr-FR");
};
