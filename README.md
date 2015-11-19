# Introduction

What is it
---------------------------------------------------------
Example Implementation of [GraphQL](https://facebook.github.io/graphql/) + [Relay](https://facebook.github.io/relay/) Server and Client.

Using
---------------------------------------------------------
1. Setup
```bash
git clone git@github.com:ironhee/graphql-server-example.git
cd graphql-server-example
npm install
brew install rethinkdb  # or another package manager
```

2. Run RethinkDB
```bash
rethinkdb
```

3. Run GraphQL server
```bash
npm run server
```

4. Show in browser
```bash
open http://localhost:5000/graphql
```

5. If you need more information, See [Development](https://ironhee.gitbooks.io/graphql-server-example/content/docs/Development.html)

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
