import express from 'express';
import schema from './schema';
import jwt from './jwt';
import graphqlHTTP from 'express-graphql';

const PORT = 3000;
const JWT_SCRET = 'THIS_IS_SECRET';
const app = express();

app.use(jwt(JWT_SCRET));
app.use('/graphql', graphqlHTTP(request => ({
  schema,
  rootValue: {
    uid: request.token ? request.token.uid : null,
  },
  graphiql: true,
})));

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('GraphQL listening at http://%s:%s', host, port);
});

