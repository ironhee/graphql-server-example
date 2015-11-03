import path from 'path';
import { promisify } from 'bluebird';
import _ncp from 'ncp';
import watch from '../lib/watch';
const ncp = promisify(_ncp);

async function copy() {
  await ncp('static/', 'dist/');

  if (global.WATCH) {
    const watcher = await watch('static/**/*.*');
    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../static/').length);
      await ncp(`static/${relPath}`, `dist/${relPath}`);
    });
  }
}

export default copy;
