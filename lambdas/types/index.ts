export const PK_PREFIX = "POKEMON#" as const;
export const SK_PREFIX = "CANDIDATE#" as const;
import { Candidate } from "../constants/candidates";

export interface PokemonDDBItem {
  pk: `${typeof PK_PREFIX}${string}`;
  sk: `${typeof SK_PREFIX}${Candidate}`;
  voteCount: number;
}
