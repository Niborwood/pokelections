import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";
import { candidates } from "../constants/candidates";
import { CORS_HEADERS, DYNAMO_TABLE_NAME } from "../constants/index";
import { parseEventBody } from "../utils";
import { PK_PREFIX, PokemonDDBItem } from "../types";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const pathParameterSchema = z.string();

const SK_PREFIX = "CANDIDATE#";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const pokemonName = pathParameterSchema.parse(event.pathParameters?.name);

    const command = new QueryCommand({
      TableName: DYNAMO_TABLE_NAME,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `${PK_PREFIX}${pokemonName}`,
      },
    });

    const response = await ddbDocClient.send(command);
    const items = (response.Items ?? []) as PokemonDDBItem[];

    const totalVotes = items.reduce((prev, curr) => {
      return (prev += curr.voteCount);
    }, 0);
    const candidates = items
      .map((item) => {
        return {
          candidate: item.sk.replace(SK_PREFIX, ""),
          votes: item.voteCount,
        };
      })
      .toSorted((a, b) => b.votes - a.votes);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        totalVotes,
        candidates,
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
