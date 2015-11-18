import test from 'ava';
import register from 'babel-core/register';
register();
import Joi from 'joi';
import { promisify } from 'bluebird';
import { createModel } from '../models';
import { r } from '../thinky';

const TABLE = 'modelTest';
let Model;
const validate = promisify(Joi.validate);

test.before(async t => {
  Model = createModel(TABLE, {});
  await Model.delete().run();
  t.pass();
  t.end();
});

test.beforeEach(async t => {
  await Model.delete().run();
  t.pass();
  t.end();
});

test.after(async t => {
  r.tableDrop(TABLE);
  await r.getPool().drain();
  t.pass();
  t.end();
});

test.serial('Document.createdAt & Document.id', async t => {
  const model = await Model.save({});
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    createdAt: Joi.date().required(),
  }).required();
  await validate(model, schema);
  t.end();
});

test.serial('#exist with exist index when db is non-empty', async t => {
  await Model.save([{}]);
  t.false(await Model.exist(-2));
  t.true(await Model.exist(-1));
  t.true(await Model.exist(0));
  t.false(await Model.exist(1));
  t.end();
});

test.serial('#exist when db is empty', async t => {
  t.false(await Model.exist(-1));
  t.false(await Model.exist(0));
  t.false(await Model.exist(1));
  t.end();
});
