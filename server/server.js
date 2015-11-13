import dotenv from 'dotenv';
dotenv.load();

import express from 'express';
import graphqlHTTP from 'express-graphql';
import jwt from './middlewares/jwt';
import bodyParser from 'body-parser';
import schema from './schema';
import { router as userRouter } from './endpoints/userEndpoint';

export const GRAPHQL_PORT = parseInt(process.env.PORT, 10);

// Expose a GraphQL endpoint
export function run() {
  const server = express();
  server.use(jwt(process.env.JWT_SECRET));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use('/', [
    userRouter,
    graphqlHTTP(
      request => ({
        schema,
        pretty: true,
        rootValue: {
          uid: request.token ? request.token.userid : null,
        },
        graphiql: true,
      })
    ),
  ]);
  server.listen(GRAPHQL_PORT, () => {
    console.log(`Server is now running on http://localhost:${GRAPHQL_PORT}`);
  });
}
