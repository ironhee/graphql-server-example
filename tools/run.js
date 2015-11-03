import run from './lib/run';
import build from './tasks/build';
import serve from './tasks/serve';
import clean from './tasks/clean';
import bundle from './tasks/bundle';
import copy from './tasks/copy';
import updateSchema from './tasks/updateSchema';
import graphqlServer from './tasks/graphqlServer';

const tasks = {
  build,
  serve,
  clean,
  bundle,
  copy,
  updateSchema,
  graphqlServer,
};

if (process.argv.length > 2) {
  const module = process.argv[2];
  run(tasks[module]).catch(err => console.error(err.stack));
}
