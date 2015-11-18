import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GRAPHQL_PORT, JWT_SECRET } from '../config';
import jwt from './middlewares/jwt';
import bodyParser from 'body-parser';
import Schema from './schema';
import { router as authRouter } from './rest/auth';


// Expose a GraphQL endpoint
export function run() {
  const server = express();
  server.use(jwt(JWT_SECRET));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use('/', [
    authRouter,
    graphqlHTTP(
      request => ({
        schema: Schema,
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
