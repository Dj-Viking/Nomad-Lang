import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from '../resolvers/user';
import { CardResolver } from "../resolvers/card";
import { GraphQLSchema } from "graphql";
import { authMiddleware } from "../utils/authMiddleWare";


export async function TestServer() {
  const app = express();
  app.use(express.json());
  //create schema
  const MyGraphQLSchema = await buildSchema({
    resolvers: [UserResolver, CardResolver],
    // scalarsMap: [{ type: CategorizedCardMapClass, scalar: CategorizedCardMapClassScalar }],
    validate: false
  });
  //create apollo server
  const apolloServer = new ApolloServer({
    schema: MyGraphQLSchema,
    context: authMiddleware
  });
  //apollo server middleware
  apolloServer.applyMiddleware({
    app,
  });
  return app;
}