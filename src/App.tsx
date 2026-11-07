import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPokemon, voteForPokemon } from "./api/pokemon";
import "./App.css";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import {
  getCandidateBall,
  getRandomPokemonID,
  getTranslatedPokemonName,
} from "./utils";
import type { PokemonSpecies } from "./types";
import { useEffect, useState } from "react";
import { candidates } from "../lambdas/constants/candidates";

// TODO :
// - Do the layout
// - Display pokemon votes
// - Display candidates Pokemons
// - Remember votes in local storage and exclude them from the available pokemons
// - Add a filter button by generations
// - Remember last ball

function App() {
  const queryClient = useQueryClient();
  const [randomPokemonID, setRandomPokemonID] = useState<number | null>(null);
  useEffect(() => {
    setRandomPokemonID(getRandomPokemonID());
  }, []);

  const pokemonQuery = useQuery<PokemonSpecies>({
    queryKey: ["getPokemon", randomPokemonID],
    queryFn: async () => await getPokemon(randomPokemonID ?? 0),
    enabled: randomPokemonID !== null,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const voteMutation = useMutation({
    mutationFn: async ({
      pokemonName,
      candidate,
    }: {
      pokemonName: string;
      candidate: string;
    }) => {
      return await voteForPokemon(pokemonName, candidate);
    },
    onSuccess: (data) => {
      console.log("Vote successful:", data);
      setRandomPokemonID(getRandomPokemonID()); // Fetch a new random Pokemon after a successful vote
      queryClient.invalidateQueries({
        queryKey: ["getPokemon", randomPokemonID],
      });
    },
    onError: (error) => {
      console.error("Error voting for Pokemon:", error);
    },
  });

  const { ref: refDraggable } = useDraggable({
    id: "draggable",
  });

  useEffect(() => {
    const vote = async () => {
      const res = await fetch(
        "https://80p0jbryqc.execute-api.eu-west-3.amazonaws.com/prod/vote",
        {
          method: "POST",
        },
      );

      console.log("api", await res.json());
    };

    vote();
  }, []);

  const { ref: refDroppable } = useDroppable({
    id: "droppable",
  });

  const handleDragStart = () => {
    console.log("Drag started");
  };

  const handleDragEnd = () => {
    console.log("Drag ended");
  };

  const handleCollision = () => {
    console.log("Collision detected");
  };

  const pokemon = pokemonQuery.data;

  return (
    <>
      {/*Title*/}
      <h1 className="text-3xl font-bold underline">Pokélections</h1>
      <h2>Attrape ce Pokémon !</h2>

      {/*Pokemon display*/}
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
              ref={refDroppable}
              id={pokemon.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonID}.png`}
              alt={pokemon.name}
            />
          </div>
        )}
      </section>

      {/*Ball display*/}
      <section>
        <div className="carousel-balls"></div>
        {candidates.map((candidate) => (
          <button
            className="border-2 p-2 flex gap-2 items-center"
            onClick={async () =>
              await voteMutation.mutateAsync({
                pokemonName: getTranslatedPokemonName(pokemon!),
                candidate,
              })
            }
          >
            {voteMutation.isPending &&
            voteMutation.variables?.candidate === candidate
              ? "En cours..."
              : `Lancer une ${candidate} ball !`}
            <img
              ref={refDraggable}
              id={candidate}
              src={getCandidateBall(candidate)}
              alt={`${candidate} Ball`}
            />
          </button>
        ))}
      </section>

      {/*Footer*/}
      <footer className="absolute bottom-0 text-xs text-center w-full p-1">
        0% IA : aucun token n'a été utilisé pour faire ce site. PokeAPI pour les
        données Pokémon.
      </footer>
    </>
  );
}

export default App;
