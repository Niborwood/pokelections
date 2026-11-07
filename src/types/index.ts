export type PokemonSpecies = {
  name: string;
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>
}
