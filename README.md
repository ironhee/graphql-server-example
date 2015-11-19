# GraphQL & Relay Implement Example

What is it?
---------------------------------------------------------
 Example Implementation of [GraphQL](https://facebook.github.io/graphql/) Server.
It use graphql-js, graphql-relay-js, rethinkdb, express.

Stack
---------------------------------------------------------

+ Server
  - Runtime: [babel](https://github.com/babel/babel)
  - HTTP Server: [express](https://github.com/strongloop/express)
  - GraphQL: [graphql](https://github.com/graphql/graphql-js), [graphql-relay](https://github.com/graphql/graphql-relay-js)
  - Database Driver: [thinky](https://github.com/neumino/thinky), [rethinkdash](https://github.com/neumino/rethinkdbdash)
  - Database: [rethinkdb](http://rethinkdb.com/)

+ Client
  - View Component: [react](https://github.com/facebook/react)
  - Routing: [react-router](https://github.com/rackt/react-router), [react-router-relay](https://github.com/relay-tools/react-router-relay)
  - Network & Store: [relay](https://github.com/facebook/relay)
  - Build: [webpack](https://github.com/webpack/webpack)

+ Testing
  - https://github.com/sindresorhus/ava

+ Task Management
  - https://github.com/kriasoft/react-starter-kit

## Setup

```bash
npm install
```

## Run

```bash
rethinkdb  # run rethinkdb
npm run server  # run graphql server
npm run build-watch  # run webpack dev server (client)
```

## Debug

- Run server
- graphiql [http://localhost:5000/graphql](http://localhost:5000/graphql)
- relay client [http://localhost:3000/](http://localhost:3000/)

## Test

```bash
npm run test  # test once
npm run test-watch  # watch test
```

## Related Links

- [awesome-graphql](https://github.com/chentsulin/awesome-graphql)
- [Overview of GraphQL](https://github.com/facebook/graphql)
- [Specification for GraphQL](https://facebook.github.io/graphql/)
- [Your First GraphQL Server](https://medium.com/@clayallsopp/your-first-graphql-server-3c766ab4f0a2#.r2j8gkb22)
- GraphQL Relay Specification
  - [Overview](http://facebook.github.io/relay/docs/graphql-relay-specification.html#content)
  - [Reference Implemantation](https://github.com/graphql/graphql-relay-js)
  - [Relay Global Object Identification](http://facebook.github.io/relay/graphql/objectidentification.htm)
  - [Relay Cursor Connections](http://facebook.github.io/relay/graphql/connections.htm)
  - [Relay Input Object Mutations](http://facebook.github.io/relay/graphql/mutations.htm)
- [graphiql](https://github.com/graphql/graphiql)
- [rethinkdb](https://www.rethinkdb.com/)
- [thinky](https://github.com/neumino/thinky)
