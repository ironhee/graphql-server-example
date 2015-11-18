import test from 'ava';
import register from 'babel-core/register';
register();
import _ from 'lodash';
import {
  indexOfResource,
  nodeIdToCursor,
  cursorToNodeId,
  resourceIdToCursor,
  cursorToResourceId,
  applyCursorsToEdgeOffsets,
  edgeOffsetsToReturn,
  // connectionArgsToOffsets,
} from '../arrayConnection';
import { createModel } from '../../models';
import { r } from '../../thinky';

const TABLE = 'arrayConnectionTest';
let Model;

test.before(async t => {
  Model = createModel(TABLE, {});
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

test.serial('#indexOfResource', async t => {
  await Model.save([{}, {}]);
  const query = Model;
  const resources = await query.run();

  t.is(await indexOfResource(query, resources[0].id), 0);
  t.is(await indexOfResource(query, resources[1].id), 1);

  t.end();
});

test('#nodeIdToCursor, #cursorToNodeId', t => {
  const cursor = nodeIdToCursor('example');
  const nodeId = cursorToNodeId(cursor);
  t.not(cursor, 'example');
  t.is(nodeId, 'example');
  t.end();
});

test('#resourceIdToCursor, #cursorToResourceId', t => {
  const cursor = resourceIdToCursor('fooType', 'example');
  const resourceId = cursorToResourceId(cursor);
  t.not(cursor, 'example');
  t.is(resourceId, 'example');
  t.end();
});

test.serial('#applyCursorsToEdgeOffsets with before', async t => {
  await Model.save(_.times(20, () => ({})));
  const resource = await Model.nth(10).run();
  const {
    afterOffset,
    beforeOffset,
  } = await applyCursorsToEdgeOffsets(Model, {
    before: resourceIdToCursor(TABLE, resource.id),
  });
  t.is(afterOffset, 0);
  t.is(beforeOffset, 9);
  t.end();
});

test.serial('#applyCursorsToEdgeOffsets with after', async t => {
  await Model.save(_.times(20, () => ({})));
  const resource = await Model.nth(10).run();
  const {
    afterOffset,
    beforeOffset,
  } = await applyCursorsToEdgeOffsets(Model, {
    after: resourceIdToCursor(TABLE, resource.id),
  });
  t.is(afterOffset, 11);
  t.is(beforeOffset, 19);

  t.end();
});


test.serial('#applyCursorsToEdgeOffsets with both', async t => {
  await Model.save(_.times(20, () => ({})));
  const afterResource = await Model.nth(5).run();
  const beforeResource = await Model.nth(15).run();
  const {
    afterOffset,
    beforeOffset,
  } = await applyCursorsToEdgeOffsets(Model, {
    after: resourceIdToCursor(TABLE, afterResource.id),
    before: resourceIdToCursor(TABLE, beforeResource.id),
  });
  t.is(afterOffset, 6);
  t.is(beforeOffset, 14);

  t.end();
});

test('#edgeOffsetsToReturn with first: 0', t => {
  t.throws(() => edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 19,
  }, {
    first: 0,
  }), Error);
  t.end();
});

test('#edgeOffsetsToReturn with first: half', t => {
  const { startOffset, endOffset } = edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 19,
  }, {
    first: 10,
  });
  t.is(startOffset, 0);
  t.is(endOffset, 9);
  t.end();
});

test('#edgeOffsetsToReturn with last: 0', t => {
  t.throws(() => edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 10,
  }, {
    first: 0,
  }), Error);
  t.end();
});

test('#edgeOffsetsToReturn with last: falf', t => {
  const { startOffset, endOffset } = edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 19,
  }, {
    last: 10,
  });
  t.is(startOffset, 10);
  t.is(endOffset, 19);
  t.end();
});

test('#edgeOffsetsToReturn with both', t => {
  const { startOffset, endOffset } = edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 9,
  }, {
    first: 9,
    last: 8,
  });
  t.is(startOffset, 1);
  t.is(endOffset, 8);
  t.end();
});

test('#edgeOffsetsToReturn with both: 0', t => {
  t.throws(() => edgeOffsetsToReturn({
    afterOffset: 0,
    beforeOffset: 10,
  }, {
    first: 0,
    last: 0,
  }), Error);
  t.end();
});
