import "./App.css";
import { getRandomPokemonID } from "./utils";
import { useEffect, useState, createContext } from "react";
import { Opponent } from "./components/Opponent";
import { User } from "./components/User";
import { Actions } from "./components/Actions";

// TODO :
// - Do the layout
// - Display pokemon votes
// - Display candidates Pokemons
// - Remember votes in local storage and exclude them from the available pokemons
// - Add a filter button by generations
// - Remember last ball
//

export const AppContext = createContext({
  randomPokemonID: null,
  setRandomPokemonID: null,
});

function App() {
  const [randomPokemonID, setRandomPokemonID] = useState<number | null>(null);
  useEffect(() => {
    setRandomPokemonID(getRandomPokemonID());
  }, []);

  return (
    <AppContext
      value={{
        randomPokemonID,
        setRandomPokemonID,
      }}
    >
      <section id="pokemon-screen">
        <Opponent />
        <User />
        <Actions />
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
