import test from 'ava';
import register from 'babel-core/register';
register();
import { GraphQLString } from 'graphql';
import _ from 'lodash';
import {
  Endpoint,
} from '../endpoint';
import { createModel } from '../../models';
import { r } from '../../thinky';

const TABLE = 'endpointTest';
let Model;
let endpoint;

test.before(async t => {
  Model = createModel(TABLE, {});
  endpoint = new Endpoint(Model, {
    id: {
      type: GraphQLString,
    },
  });
  await Model.delete().run();
  t.end();
});

test.beforeEach(async t => {
  await Model.delete().run();
  t.end();
});

test.after(async t => {
  r.tableDrop(TABLE);
  await r.getPool().drain();
  t.end();
});

test.serial('Endpoint#getConnection with before', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    first: 10,
  });
  t.is(edges.length, 10);
  t.is(pageInfo.hasNextPage, true);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});

test.serial('Endpoint#getConnection with before', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    first: 20,
  });
  t.is(edges.length, 20);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});

test.serial('Endpoint#getConnection with before', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    first: 20,
  });
  t.is(edges.length, 20);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});

test.serial('Endpoint#getConnection with last', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    last: 20,
  });
  t.is(edges.length, 20);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});
