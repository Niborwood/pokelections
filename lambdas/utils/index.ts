import type { ZodType } from "zod";
import { CORS_HEADERS } from "../constants";

export const parseEventBody = <T>(body: string | null, schema: ZodType<T>) => {
  if (!body) throw new Error("No body content");

  try {
    return schema.parse(JSON.parse(body));
  } catch (error) {
    throw new Error("Error parsing the body");
  }
};
