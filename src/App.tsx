import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteForPokemon } from "./api/pokemon";
import "./App.css";
import {
  getRandomPokemonID,
} from "./utils";
import { useEffect, useState } from "react";
import { Opponent } from "./components/Opponent";
import { User } from "./components/User";

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

  return (
    <>
      {/*Pokemon display*/}


      {/*Ball display*/}
      <section id="pokemon-screen">

        <Opponent randomPokemonID={randomPokemonID} />
        <User />
        <div id="actions" className="border-4">
          <div id=""></div>
        </div>
        {/*{candidates.map((candidate) => (
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
              id={candidate}
              src={getCandidateBall(candidate)}
              alt={`${candidate} Ball`}
            />
          </button>
        ))}*/}
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
