import run from '../lib/run';
import bundle from './bundle';

async function serve() {
  global.WATCH = true;
  await run(bundle);
}

export default serve;
