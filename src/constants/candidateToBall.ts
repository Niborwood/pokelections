import type { Candidate } from "../../lambdas/constants/candidates";

export const balls = ["poke-ball", "great-ball", "ultra-ball"] as const;

export const candidateToBall: Record<Candidate, (typeof balls)[number]> = {
  melenchon: "poke-ball",
  philippe: "ultra-ball",
  arthaud: "great-ball",
  asselineau: "poke-ball",
  attal: "great-ball",
  "dupont-aignan": "ultra-ball",
  durif: "poke-ball",
  glucksmann: "great-ball",
  lepen: "ultra-ball",
  lisnard: "poke-ball",
  retailleau: "great-ball",
  roussel: "ultra-ball",
  ruffin: "poke-ball",
  tondelier: "great-ball",
  zemmour: "ultra-ball",
};
