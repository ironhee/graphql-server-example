const config = {
  RETHINK_HOST: 'localhost',
  RETHINK_PORT: 20815,
  RETHINK_DB: 'dev',
  STATIC_PORT: 3000,
  GRAPHQL_PORT: 5000,
  JWT_SECRET: 'this is verrrrrrry private thing',
};

const testConfig = {
  ...config,
  RETHINK_DB: 'test',
};

export default process.env.TEST ? testConfig : config;
