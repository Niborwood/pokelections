import { useMutation } from "@tanstack/react-query";
import { voteForPokemon } from "../api/pokemon";
import { getRandomPokemonID } from "../utils";
import type { Dispatch, SetStateAction } from "react";

interface ActionsProps {
  randomPokemonID: number | null;
  setRandomPokemonID: Dispatch<SetStateAction<number | null>>;
}

export const Actions = ({ setRandomPokemonID }: ActionsProps) => {
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
      // queryClient.invalidateQueries({
      //   queryKey: ["getPokemon", randomPokemonID],
      // });
    },
    onError: (error) => {
      console.error("Error voting for Pokemon:", error);
    },
  });

  const handleRun = () => {
    setRandomPokemonID(getRandomPokemonID());
  };

  return (
    <section className="border-4 flex justify-end">
      <div></div>
      <div className="grid grid-cols-2 w-fit gap-2 border-4 p-1">
        <button>BALLS</button>
        <button>PKMN</button>
        <button>CANDI</button>
        <button onClick={handleRun}>RUN</button>
      </div>
    </section>
  );
};
