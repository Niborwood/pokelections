import { CfnOutput, Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";

export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // BUCKET

    const s3CorsRule: s3.CorsRule = {
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
      maxAge: 300,
    };

    const s3Bucket = new s3.Bucket(this, "PokelectionsS3Bucket", {
      bucketName: "pokelections-niwd-s3-cloudfront",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      cors: [s3CorsRule],
    });

    // CLOUDFRONT - CDN

    const oai = new cloudfront.OriginAccessIdentity(this, "PokelectionsOAI");
    s3Bucket.grantRead(oai);

    const backendCloudfront = new cloudfront.Distribution(
      this,
      "PokElectionsDist",
      {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(s3Bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
      },
    );

    new deployment.BucketDeployment(this, "PokeElectionsDeployWebsite", {
      sources: [deployment.Source.asset("dist/vite")],
      destinationBucket: s3Bucket,
      distribution: backendCloudfront,
      distributionPaths: ["/*"],
    });

    // DYNAMO STORAGE

    const votesTable = new dynamo.Table(this, "VotesTable", {
      partitionKey: { name: "pk", type: dynamo.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamo.AttributeType.STRING },
      tableName: "PokElectionsVotesTable",
    });

    votesTable.addGlobalSecondaryIndex({
      partitionKey: { name: "sk", type: dynamo.AttributeType.STRING },
      sortKey: { name: "voteCount", type: dynamo.AttributeType.NUMBER },
      indexName: "PokElectionsVotesTableGSI",
    });

    // LAMBDAS

    const voteLambda = new lambda.Function(this, "VoteLambda", {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("dist/lambdas/vote"),
    });
    votesTable.grantWriteData(voteLambda);

    const getPokemonVotesLambda = new lambda.Function(
      this,
      "GetPokemonVotesLambda",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("dist/lambdas/get-pokemon-votes"),
      },
    );
    votesTable.grantReadData(getPokemonVotesLambda);

    const getCandidateVotesLambda = new lambda.Function(
      this,
      "getCandidateVotesLambda",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("dist/lambdas/get-candidate-votes"),
      },
    );
    votesTable.grantReadData(getCandidateVotesLambda);

    // API GATEWAY

    const voteApi = new apigateway.RestApi(this, "VoteApi", {
      description: "PokElections API",
    });

    const postVote = voteApi.root.addResource("vote");
    postVote.addMethod("POST", new apigateway.LambdaIntegration(voteLambda));
    postVote.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["POST"],
    });

    const getPokemonVotes = voteApi.root.addResource("get-pokemon-votes");
    const getPokemonVotesWithName = getPokemonVotes.addResource("{name}");
    getPokemonVotesWithName.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getPokemonVotesLambda),
    );
    getPokemonVotesWithName.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET"],
    });

    const getCandidateVotes = voteApi.root.addResource("get-candidate-votes");
    const getCandidateVotesWithName = getCandidateVotes.addResource("{name}");
    getCandidateVotesWithName.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getCandidateVotesLambda),
    );
    getCandidateVotesWithName.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET"],
    });

    // OUTPUTS

    new CfnOutput(this, "CloudFrontDistributionDomainName", {
      value: backendCloudfront.distributionDomainName,
    });
    new CfnOutput(this, "VoteApiEndpoint", { value: voteApi.url });
  }
}
