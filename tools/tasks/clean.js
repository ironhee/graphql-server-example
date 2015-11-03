import del from 'del';
import fs from '../lib/fs';

async function clean() {
  await del(['.tmp', 'dist/'], { dot: true });
  await fs.makeDir('dist/');
}

export default clean;
