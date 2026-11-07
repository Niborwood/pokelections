export const candidates = [
  "melenchon",
  "philippe",
  "arthaud",
  "asselineau",
  "attal",
  "dupont-aignan",
  "durif",
  "glucksmann",
  "lepen",
  "lisnard",
  "retailleau",
  "roussel",
  "ruffin",
  "tondelier",
  "zemmour",
] as const;
export type Candidate = (typeof candidates)[number];
