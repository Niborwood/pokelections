import { useContext } from "react";
import { SubMenuContext } from "./Actions";
import { getRandomPokemonID } from "../utils";
import { AppContext } from "../App";

export const ActionDefault = () => {
  const { setActiveSubMenu } = useContext(SubMenuContext);
  const { setRandomPokemonID } = useContext(AppContext);

  const handleRun = () => {
    setRandomPokemonID(getRandomPokemonID());
  };

  return (
    <div className="grid grid-cols-2 w-fit gap-2 border-4 p-1">
      <button onClick={() => setActiveSubMenu("BALLS")}>BALLS</button>
      <button onClick={() => setActiveSubMenu("PKMN")}>PKMN</button>
      <button onClick={() => setActiveSubMenu("CANDI")}>CANDI</button>
      <button onClick={handleRun}>RUN</button>
    </div>
  );
};
