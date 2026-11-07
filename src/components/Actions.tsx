import { useMutation } from "@tanstack/react-query";
import { voteForPokemon } from "../api/pokemon";
import { getRandomPokemonID } from "../utils";
import { createContext, useContext, useState } from "react";
import { AppContext } from "../App";
import { ActionDefault } from "./Action-default";
import { ActionBalls } from "./Action-balls";

type SubMenu = "BALLS" | "PKMN" | "CANDI";
export const SubMenuContext = createContext({
  activeSubMenu: null,
  setActiveSubMenu: null,
});

export const Actions = () => {
  const { setRandomPokemonID } = useContext(AppContext);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu | null>(null);
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

  const getDisplayedMenu = () => {
    switch (activeSubMenu) {
      case "BALLS":
        return <ActionBalls />;
      case "CANDI":
        return <div>Candidate</div>;
      case "PKMN":
        return <div>Pokemon</div>;
      default:
        return <ActionDefault />;
    }
  };

  return (
    <SubMenuContext
      value={{
        activeSubMenu,
        setActiveSubMenu,
      }}
    >
      <section className="border-4 flex justify-end">
        <div></div>
        {getDisplayedMenu()}
      </section>
    </SubMenuContext>
  );
};
