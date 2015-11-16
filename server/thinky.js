import Thinky from 'thinky';
import {
  // RETHINK_HOST,
  // RETHINK_PORT,
  RETHINK_DB,
} from '../config';

const thinky = new Thinky({
  // host: RETHINK_HOST,
  // port: RETHINK_PORT,
  db: RETHINK_DB,
});

export default thinky;
