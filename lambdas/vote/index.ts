import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import { candidates } from "../constants/candidates";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventBodySchema = z.object({
  candidate: z.enum(candidates),
  pokemonName: z.string(),
});

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Missing request body",
      }),
    };
  }

  const parseResult = eventBodySchema.safeParse(JSON.parse(event.body));
  if (!parseResult.success) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Invalid request body",
        errors: parseResult.error.issues,
      }),
    };
  }

  const { candidate, pokemonName } = parseResult.data;
  const command = new UpdateCommand({
    TableName: "PokElectionsVotesTable",
    Key: {
      pk: `POKEMON#${pokemonName}`,
      sk: `CANDIDATE#${candidate}`,
    },
    UpdateExpression: "SET voteCount = if_not_exists(voteCount, :start) + :inc",
    ExpressionAttributeValues: {
      ":start": 0,
      ":inc": 1,
    },
  });

  try {
    const data = await ddbDocClient.send(command);
    console.log("Success - item added or updated", data);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: `Vote OK -> ${pokemonName} for ${candidate}`,
      }),
    };
  } catch (err) {
    console.error("Error", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
};
