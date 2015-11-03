import dotenv from 'dotenv';
dotenv.load();

import express from 'express';
import schema from './schema';
import jwt from './jwt';
import graphqlHTTP from 'express-graphql';

export const GRAPHQL_PORT = 8000;
export const JWT_SCRET = 'THIS_IS_SECRET';

// Expose a GraphQL endpoint
export const graphQLServer = express();
graphQLServer.use(jwt(JWT_SCRET));
graphQLServer.use('/', graphqlHTTP(request => ({
  schema,
  pretty: true,
  rootValue: {
    uid: request.token ? request.token.uid : null,
  },
  graphiql: true,
})));
graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`);
});
