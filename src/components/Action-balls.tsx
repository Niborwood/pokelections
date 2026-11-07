import { useContext } from "react";
import { SubMenuContext } from "./Actions";
import { candidates } from "../../lambdas/constants/candidates";
import { useMutation } from "@tanstack/react-query";
import { voteForPokemon } from "../api/pokemon";
import { getRandomPokemonID } from "../utils";
import { AppContext } from "../App";

export const ActionBalls = () => {
  const { setActiveSubMenu } = useContext(SubMenuContext);
  const { setRandomPokemonID, currentPokemonName } = useContext(AppContext);

  const resetPokemonID = () => setRandomPokemonID(getRandomPokemonID());

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
      resetPokemonID();
    },
    onError: (error) => {
      console.error("Error voting for Pokemon:", error);
    },
  });

  return (
    <div className="relative max-h-[80px]">
      <div className="border-4 relative bottom-[148px] right-1 max-w-[146px] w-[146px] max-h-[140px] flex flex-col justify-left overflow-hidden overflow-y-auto bg-white items-start pl-2">
        {candidates.map((candidate) => {
          return (
            <button
              key={candidate}
              onClick={async () => {
                await voteMutation.mutateAsync({
                  candidate,
                  pokemonName: currentPokemonName,
                });

                setActiveSubMenu(null);
              }}
            >
              {candidate}
            </button>
          );
        })}
        <button onClick={() => setActiveSubMenu(null)}>RETOUR</button>
      </div>
    </div>
  );
};
