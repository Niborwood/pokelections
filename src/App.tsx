import "./App.css";
import { getRandomPokemonID } from "./utils";
import { useEffect, useState, createContext } from "react";
import { Opponent } from "./components/Opponent";
import { User } from "./components/User";
import { Actions } from "./components/Actions";

// TODO :
// - Display pokemon votes
// - Display candidates Pokemons
// - Remember votes in local storage and exclude them from the available pokemons
// - Add a filter button by generations
// - Remember last ball
// - Do cross/ab buttons
// - Do Start/tutorial/options menu
// - locally store reordering of balls using Select
// - Polish the layout
// - Do animations
// - Add a 1/X chance of a Shiny. If Shiny, your vote counts 10 times.

export const AppContext = createContext({
  randomPokemonID: null,
  setRandomPokemonID: undefined,
  currentPokemonName: undefined,
  setCurrentPokemonName: undefined,
});

function App() {
  const [randomPokemonID, setRandomPokemonID] = useState<number | null>(null);
  const [currentPokemonName, setCurrentPokemonName] = useState<string | null>(
    null,
  );
  useEffect(() => {
    setRandomPokemonID(getRandomPokemonID());
  }, []);

  return (
    <AppContext
      value={{
        randomPokemonID,
        setRandomPokemonID,
        currentPokemonName,
        setCurrentPokemonName,
      }}
    >
      <section
        id="pokemon-screen"
        className="max-w-[380px] w-[380px] max-h-[380px] h-[380px] m-auto mt-4 border-6 flex flex-col justify-between p-0.5"
      >
        <Opponent />
        <div className="">
          <User />
          <div className="">
            <Actions />
          </div>
        </div>
      </section>

      {/*Footer*/}
      <footer className="absolute bottom-0 text-xs text-center w-full p-1">
        0% IA : aucun token n'a été utilisé pour faire ce site. PokeAPI pour les
        données Pokémon.
      </footer>
    </AppContext>
  );
}

export default App;
