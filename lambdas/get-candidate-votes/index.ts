import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import {
  CORS_HEADERS,
  DYNAMO_TABLE_GSI_NAME,
  DYNAMO_TABLE_NAME,
} from "../constants/index";
import { PK_PREFIX, PokemonDDBItem, SK_PREFIX } from "../types";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const pathParameterSchema = z.string();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const candidate = pathParameterSchema.parse(event.pathParameters?.name);

    const command = new QueryCommand({
      TableName: DYNAMO_TABLE_NAME,
      IndexName: DYNAMO_TABLE_GSI_NAME,
      KeyConditionExpression: "sk = :sk",
      ExpressionAttributeValues: {
        ":sk": `${SK_PREFIX}${candidate}`,
      },
    });

    const response = await ddbDocClient.send(command);
    console.log("response");
    const items = (response.Items ?? []) as PokemonDDBItem[];

    const totalVotes = items.reduce((prev, curr) => {
      return (prev += curr.voteCount);
    }, 0);

    const pokemons = items
      .map((item) => {
        return {
          pokemon: item.pk.replace(PK_PREFIX, ""),
          votes: item.voteCount,
        };
      })
      .toSorted((a, b) => b.votes - a.votes);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        totalVotes,
        pokemons,
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
