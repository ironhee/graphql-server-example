import express from 'express';
import graphqlHTTP from 'express-graphql';
import _ from 'lodash';
import { GRAPHQL_PORT, JWT_SECRET } from '../config';
import jwt from './middlewares/jwt';
import currentUser from './middlewares/currentUser';
import bodyParser from 'body-parser';
import Schema from './schema';
import { router as authRouter } from './rest/auth';


export const server = express();

// Middlewares
server.use([
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  // bussiness logic
  jwt(JWT_SECRET),
  currentUser,
]);

// REST Routers
server.use([
  authRouter,
]);

// GraphQL
server.use('/graphql', graphqlHTTP(
  req => ({
    schema: Schema,
    pretty: true,
    rootValue: _.pick(req, 'token', 'currentUser'),
    graphiql: true,
  })
));

export function run() {
  server.listen(GRAPHQL_PORT, () => {
    console.log(`Server is now running on http://localhost:${GRAPHQL_PORT}`);
  });
}
