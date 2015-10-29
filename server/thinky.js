import Thinky from 'thinky';

const thinky = new Thinky({
  host: process.env.RETHINK_HOST,
  port: process.env.RETHINK_PORT,
  db: process.env.RETHINK_DB,
});

export default thinky;
