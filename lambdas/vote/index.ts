import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import { candidates } from "../constants/candidates";
import { CORS_HEADERS } from "../constants/index";
import { parseEventBody } from "../utils";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventBodySchema = z.object({
  candidate: z.enum(candidates),
  pokemonName: z.string(),
});
type BodySchema = z.infer<typeof eventBodySchema>;

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const data = parseEventBody<BodySchema>(event.body, eventBodySchema);

    const { candidate, pokemonName } = data;
    const command = new UpdateCommand({
      TableName: "PokElectionsVotesTable",
      Key: {
        pk: `POKEMON#${pokemonName}`,
        sk: `CANDIDATE#${candidate}`,
      },
      UpdateExpression:
        "SET voteCount = if_not_exists(voteCount, :start) + :inc",
      ExpressionAttributeValues: {
        ":start": 0,
        ":inc": 1,
      },
    });

    const response = await ddbDocClient.send(command);
    console.log("Success - item added or updated", response);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: `Vote OK -> ${pokemonName} for ${candidate}`,
      }),
    };
  } catch (err) {
    console.error("Error", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
    };
  }
};
