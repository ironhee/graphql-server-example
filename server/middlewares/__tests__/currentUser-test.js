import test from 'ava';
import register from 'babel-core/register';
register();
import { spy } from 'sinon';
import userEndpoint from '../../endpoints/user';
import { r } from '../../thinky';
import currentUser from '../currentUser';

test.before(async t => {
  await userEndpoint.Model.delete().run();
  t.end();
});

test.after(async t => {
  await userEndpoint.Model.delete().run();
  await r.getPool().drain();
  t.end();
});

test('#currentUser with no token', async t => {
  const req = {};
  const resp = {};
  const next = spy();
  await currentUser(req, resp, next);
  t.true(next.called);
  t.is(req.currentUser, null);
  t.end();
});

test.serial('#currentUser with token', async t => {
  const user = await userEndpoint.create({ name: 'foo' });
  const req = {
    token: { userId: userEndpoint.toGlobalId(user.id) },
  };
  const resp = {};
  const next = spy();
  await currentUser(req, resp, next);
  t.true(next.called);
  t.ok(req.currentUser);
  t.same(req.currentUser.id, user.id);
  t.same(req.currentUser.name, user.name);
  t.same(req.currentUser.createdAt, user.createdAt);
  t.end();
});
