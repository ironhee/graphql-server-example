import test from 'ava';
import register from 'babel-core/register';
register();
import jwt from 'jwt-simple';
import { spy } from 'sinon';
import jwtMiddleware from '../jwt';

const SECRET = 'test';

test('#jwt with no token', async t => {
  const req = {};
  const resp = {};
  const next = spy();
  await jwtMiddleware(SECRET)(req, resp, next);
  t.true(next.called);
  t.is(req.token, null);
  t.end();
});

test('#jwt with token', t => {
  const token = jwt.encode({ foo: 'bar' }, SECRET);
  const req = {
    get(field) {
      if (field === 'Authorization') {
        return `Bearer ${token}`;
      }
    },
  };
  const resp = {};
  const next = spy();
  jwtMiddleware(SECRET)(req, resp, next);
  t.true(next.called);
  t.same(req.token, { foo: 'bar' });
  t.end();
});
