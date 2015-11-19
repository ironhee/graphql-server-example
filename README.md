Tasks
---------------------------------------------------------

- Setup: ```npm install```
- Run Server: ```rethinkdb```, ```npm run server```
- Update GraphQL Schema: ```npm run update-schema```
- Build Client: ```npm run build```
  + Watch: ```npm run build-watch```
- Lint: ```npm run lint```
- Test: ```npm run test```
  - Watch: ```npm run test-watch```



## Develop

+ Server
  - Run server
  - Create model (server/models.js)
  - Create endpoint (server/endpoints/example.js)
  - Add to schema (server/schema.js)
  - Update GraphQL Schema
  - Debug with graphiql [http://localhost:5000/graphql](http://localhost:5000/graphql)

+ Client
  - Watch client
  - Create component (client/components/Example.js)
  - (optional) Create mutation (client/mutations/ExampleMutation.js)
  - Add Route (client/app.js)
  - Debug with relay client [http://localhost:3000/](http://localhost:3000/)


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
