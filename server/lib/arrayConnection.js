import _ from 'lodash';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import { base64, unbase64 } from './base64';
import { r } from '../thinky';

const PREFIX = 'arrayconnection:';

async function indexOfModel(query, modelId) {
  return (
    await query.offsetsOf(r.row('id').eq(modelId)).run()
  )[0];
}

export function nodeIdToCursor(nodeId) {
  return base64(PREFIX + nodeId);
}

export function cursorToNodeId(cursor) {
  return unbase64(cursor).substring(PREFIX.length);
}

export function modelIdToCursor(modelType, modelId) {
  return nodeIdToCursor(toGlobalId(modelType, modelId));
}

export function cursorToModelId(cursor) {
  const { id: modelId } = fromGlobalId(cursorToNodeId(cursor));
  return modelId;
}

// https://facebook.github.io/relay/graphql/connections.htm#ApplyCursorsToEdgeOffsets()
export async function applyCursorsToEdgeOffsets(query, args) {
  const { after, before } = args;

  let afterOffset = 0;
  if (after) {
    const modelId = cursorToModelId(after);
    afterOffset = await indexOfModel(query, modelId);
    afterOffset = !_.isUndefined(afterOffset) ?
      afterOffset + 1 : 0;
  }

  let beforeOffset = null;
  if (before) {
    const modelId = cursorToModelId(before);
    beforeOffset = await indexOfModel(query, modelId);
    beforeOffset = !_.isUndefined(beforeOffset) ?
      Math.max(beforeOffset, afterOffset, 0) : null;
  }


  return { afterOffset, beforeOffset };
}

// https://facebook.github.io/relay/graphql/connections.htm#EdgesToReturn()
export async function edgeOffsetsToReturn(offsets, args) {
  let { afterOffset, beforeOffset } = offsets;
  const { first, last } = args;

  if (first) {
    // TODO: compute Edge length explicity
    if ((beforeOffset !== null && beforeOffset - afterOffset > first) ||
        beforeOffset === null) {
      beforeOffset = afterOffset + first;
    }
  }

  if (last) {
    // TODO: last should be performed without afterOffset(before).
    if (beforeOffset !== null && beforeOffset - afterOffset > last) {
      // EndOffset >= StartOffset >= 0
      afterOffset = Math.max(beforeOffset - last, afterOffset, 0);
    }
  }

  return { startOffset: afterOffset, endOffset: beforeOffset };
}
