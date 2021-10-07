require('dotenv').config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { IS_PROD } from "./constants";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User";
import { Card } from "./entities/Card";
import { UserResolver } from './resolvers/user';
import { CardResolver } from "./resolvers/card"
import { GraphQLSchema } from "graphql";
import { authMiddleware } from "./utils/authMiddleWare";
import { ColorLog } from "./__tests__/utils/helpers";

const logger = ColorLog;

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  CORS_ALLOWED
} = process.env;

(async function(): Promise<void> {
  console.log("hello world");
  //connect to db
  await createConnection({
    type: "postgres",
    url: undefined,
    database: !IS_PROD ? DB_NAME : undefined,
    password: !IS_PROD ? DB_PASSWORD : undefined,
    username: !IS_PROD ? DB_USER : undefined,
    logging: true,
    synchronize: true,
    ssl: IS_PROD,
    extra: IS_PROD && {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [User, Card]
  });

  new logger("green", "postgres connection success").genLog();

  //create express app
  const app = express();

  //create graphql server
  let MyGraphQLSchema: GraphQLSchema;

  //BUILD THE SCHEMA

  console.log("resolvers");
  console.log(UserResolver);
  console.log(CardResolver);
  
  
  MyGraphQLSchema = await buildSchema({
    resolvers: [UserResolver, CardResolver],
    validate: false
  });
  new logger("purple", "graphql schema build success").genLog();

  // express cors
  app.use(cors({
    origin: new RegExp(CORS_ALLOWED as string),
    credentials: true
  }))
  
  //create apollo server
  const apolloServer = new ApolloServer({
    schema: MyGraphQLSchema,
    context: authMiddleware
  });
  //apollo server middleware
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: new RegExp(CORS_ALLOWED as string),
      credentials: true
    }
  });
  
  //express middleware
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(express.json());


  //other post deployment configs

  // //IF-ENV IN PRODUCTION
  // if (process.env.NODE_ENV === 'production') {
  //   //STATIC ASSETS FROM VUE BUILD FOLDER
  //   app.use(express.static(
  //     path.join(__dirname, '../../client/dist')
  //   ));
  //   // IF TRAVELS ANY ROUTE OUTSIDE VUE'S CURRENT PAGE REDIRECT TO ROOT
  //   app.get('*', (_req, res, next) => {
  //     res.sendFile(path.join(
  //       __dirname, '../client/dist/index.html'
  //     ));
  //     next();
  //   });
  //   //REDIRECT HTTP TRAFFIC TO HTTPS
  //   app.use((req, res, next) => {
  //     if (req.header('x-forwarded-proto') !== 'https') res.redirect(`https://${req.header('host')}${req.url}`);
  //     next();
  //   });
  // }

  // app.use('/', async (_, res) => {
  //   res.status(404).send("client path eventually")
  // });

  //CREATE PORT
  const PORT = process.env.PORT || 4000;
  //SERVER LISTEN
  app.listen(PORT, () => {
    new logger("green", `server started on ${PORT}`).genLog();
    new logger("purple", `graphql server started? ${apolloServer.graphqlPath}`).genLog();
  });



})().catch((e: Error) => {
  return console.error(e);
});