import _ from 'lodash';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import { base64, unbase64 } from './base64';
import { r } from '../thinky';

const PREFIX = 'arrayconnection:';

export async function indexOfResource(query, resourceId) {
  return (
    await query.offsetsOf(r.row('id').eq(resourceId)).execute()
  )[0];
}

export function nodeIdToCursor(nodeId) {
  return base64(PREFIX + nodeId);
}

export function cursorToNodeId(cursor) {
  return unbase64(cursor).substring(PREFIX.length);
}

export function resourceIdToCursor(resourceType, resourceId) {
  return nodeIdToCursor(
    toGlobalId(resourceType, resourceId)
  );
}

export function cursorToResourceId(cursor) {
  const { id: resourceId } = fromGlobalId(
    cursorToNodeId(cursor)
  );
  return resourceId;
}

// https://facebook.github.io/relay/graphql/connections.htm#ApplyCursorsToEdgeOffsets()
export async function applyCursorsToEdgeOffsets(query, args) {
  const { after, before } = args;

  let afterOffset;
  if (after) {
    const resourceId = cursorToResourceId(after);
    afterOffset = await indexOfResource(query, resourceId);
    afterOffset = !_.isUndefined(afterOffset) ?
      afterOffset + 1 : 0;
  } else {
    afterOffset = 0;
  }

  let beforeOffset;
  if (before) {
    const resourceId = cursorToResourceId(before);
    beforeOffset = await indexOfResource(query, resourceId);
    beforeOffset = !_.isUndefined(beforeOffset) ?
      Math.max(beforeOffset, afterOffset, 0) - 1 : 0;
  } else {
    const beforeResource = await query.nth(-1).default(null).run();
    beforeOffset = beforeResource ?
      await indexOfResource(query, beforeResource.id) : 0;
  }

  return { afterOffset, beforeOffset };
}

// https://facebook.github.io/relay/graphql/connections.htm#EdgesToReturn()
export function edgeOffsetsToReturn(offsets, args) {
  let {
    afterOffset: startOffset,
    beforeOffset: endOffset,
  } = offsets;
  const { first, last } = args;

  if (first) {
    if (endOffset - startOffset + 1 > first) {
      endOffset = startOffset + first - 1;
    }
  }

  if (last) {
    if (endOffset - startOffset + 1 > last) {
      startOffset = Math.max(endOffset - last + 1, startOffset, 0);
    }
  }

  return { startOffset, endOffset };
}

export async function connectionArgsToOffsets(query, args) {
  const { after, first, before, last } = args;

  const { afterOffset, beforeOffset } = await applyCursorsToEdgeOffsets(
    query, { after, before }
  );
  const { startOffset, endOffset } = edgeOffsetsToReturn(
    { afterOffset, beforeOffset },
    { first, last }
  );

  return { afterOffset, beforeOffset, startOffset, endOffset };
}
