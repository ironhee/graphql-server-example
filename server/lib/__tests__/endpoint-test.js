import test from 'ava';
import register from 'babel-core/register';
register();
import _ from 'lodash';
import {
  Endpoint,
} from '../endpoint';
import { InvalidConnectionArgsTypeError } from '../arrayConnection';
import { createModel } from '../../models';
import { r } from '../../thinky';

const TABLE = 'endpointTest';
let Model;
let endpoint;

test.before(async t => {
  Model = createModel(TABLE, {});
  endpoint = new Endpoint(Model, {});
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

test('Endpoint#Model', async t => {
  t.is(endpoint.Model, Model);
  t.end();
});

test('Endpoint#name', async t => {
  t.is(endpoint.name, TABLE);
  t.end();
});

test.serial('Endpoint#toGlobalId & Endpoint#fromGlobalId', async t => {
  const resource = await Model.save({});
  const globalId = endpoint.toGlobalId(resource.id);
  const resourceId = endpoint.fromGlobalId(globalId);
  t.not(globalId, resourceId);
  t.is(resource.id, resourceId);
  t.end();
});

test.serial('Endpoint#create', async t => {
  const resource = await endpoint.create({});
  t.ok(resource.id);
  t.end();
});

test.serial('Endpoint#get', async t => {
  const resource = await Model.save({});
  const fetchedResource = await endpoint.get(resource.id);
  t.same(resource.id, fetchedResource.id);
  t.end();
});

test.serial('Endpoint#remove', async t => {
  const resource = await Model.save({});
  await endpoint.remove(resource.id);
  const resources = await Model.run();
  t.is(resources.length, 0);
  t.end();
});

test.serial('Endpoint#getConnection() with first: 0', async t => {
  t.throws(endpoint.getConnection({
    first: 0,
  }), InvalidConnectionArgsTypeError);
  t.end();
});

test.serial('Endpoint#getConnection() with first: half', async t => {
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

test.serial('Endpoint#getConnection() with first: full', async t => {
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

test.serial('Endpoint#getConnection() with first: over', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    first: 21,
  });
  t.is(edges.length, 20);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});

test.serial('Endpoint#getConnection() with last: 0', async t => {
  t.throws(endpoint.getConnection({
    last: 0,
  }), Error);
  t.end();
});

test.serial('Endpoint#getConnection() with last: half', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    last: 10,
  });
  t.is(edges.length, 10);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, true);
  t.end();
});

test.serial('Endpoint#getConnection() with last: full', async t => {
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

test.serial('Endpoint#getConnection() with last: over', async t => {
  await Model.save(_.times(20, () => ({})));
  const {
    pageInfo,
    edges,
  } = await endpoint.getConnection({
    last: 21,
  });
  t.is(edges.length, 20);
  t.is(pageInfo.hasNextPage, false);
  t.is(pageInfo.hasPreviousPage, false);
  t.end();
});
