# Development

## Tasks

- Setup: ```npm install```
- Run Server: ```rethinkdb```, ```npm run server```
- Update GraphQL Schema: ```npm run update-schema```
- Build Client: ```npm run build```
  + Watch: ```npm run build-watch```
- Lint: ```npm run lint```
- Test: ```npm run test```
  - Watch: ```npm run test-watch```

## Develop Server

- Run server
- Create model (server/models.js)
- Create endpoint (server/endpoints/example.js)
- Add to schema (server/schema.js)
- Update GraphQL Schema
- Debug with graphiql [http://localhost:5000/graphql](http://localhost:5000/graphql)

## Develop Client

- Watch client
- Create component (client/components/Example.js)
- (optional) Create mutation (client/mutations/ExampleMutation.js)
- Add Route (client/app.js)
- Debug with relay client [http://localhost:3000/](http://localhost:3000/)
