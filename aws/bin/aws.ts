#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { AwsStack } from "../lib/aws-stack";

const app = new cdk.App();
new AwsStack(app, "PokElectionsStack", {
  env: { account: process.env.AWS_ACCOUNT, region: "eu-west-3" },
  tags: {
    project: "pokelections",
  },
});
