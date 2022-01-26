require('dotenv').config();
import "reflect-metadata";
import express from "express";
import { IS_PROD } from "./constants";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from './resolvers/user';
import { CardResolver } from "./resolvers/card"
import { GraphQLSchema } from "graphql";
import { authMiddleware } from "./utils/authMiddleWare";
import { ColorLog } from "./__tests__/utils/helpers";
import path from "path";
import { createDbConnection } from "./db/connection";
import { readEnv } from "./utils/readEnv";
readEnv();

const PORT = process.env.PORT || 4000;
const logger = ColorLog;

const {
  CORS_ALLOWED_PROD,
  CORS_ALLOWED_DEV,
  // NODEMAILER_EMAIL_TO
} = process.env;

(async function(): Promise<void> {
  console.log("hello world");
  await createDbConnection();
  new logger("green", "postgres connection success").genLog();
  
  const app = express();
  let MyGraphQLSchema: GraphQLSchema;
  MyGraphQLSchema = await buildSchema({
    resolvers: [UserResolver, CardResolver],
    // scalarsMap: [{ type: CategorizedCardMapClass, scalar: CategorizedCardMapClassScalar }],
    validate: false
  });
  new logger("purple", "graphql schema build success").genLog();

  const corsRegExp = ((): RegExp => {
    if (IS_PROD) {
      return new RegExp(CORS_ALLOWED_PROD as string);
    }
    return new RegExp(CORS_ALLOWED_DEV as string);
  })();
  app.use(cors({
    origin: corsRegExp,
    credentials: true
  }));

  const apolloServer = new ApolloServer({
    schema: MyGraphQLSchema,
    context: authMiddleware
  });
  //apollo server middleware
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: corsRegExp,
      credentials: true
    }
  });
  
  //express middleware
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(express.json());

  //IF-ENV IN PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    //STATIC ASSETS FROM VUE BUILD FOLDER
    app.use(express.static(
      path.join(__dirname, '../../client/dist')
    ));
    // IF TRAVELS ANY ROUTE OUTSIDE VUE'S CURRENT PAGE REDIRECT TO ROOT
    // app.get('*', (_req, res, next) => {
    //   res.sendFile(path.join(
    //     __dirname, '../client/dist/index.html'
    //   ));
    //   next();
    // });
    //REDIRECT HTTP TRAFFIC TO HTTPS
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') res.redirect(`https://${req.header('host')}${req.url}`);
      next();
    });
  }

  app.use('/', async (_, res) => {
    res.status(404).send("client path eventually")
  });

  
  //SERVER LISTEN
  app.listen(PORT, () => {
    new logger("green", `server started on ${PORT}`).genLog();
    new logger("purple", `graphql server started? ${apolloServer.graphqlPath}`).genLog();
  });



})().catch((e: Error) => {
  return console.error(e);
});