import Thinky from 'thinky';
import {
  getOffsetWithDefault,
} from 'graphql-relay';
const thinky = new Thinky();
const { type: TYPE, r } = thinky;


const RESOURCES = {
  Draft: thinky.createModel('Draft', {
    id: TYPE.string().min(2),
    createdAt: TYPE.date().default(r.now()),
  }),
};


export function getOffsetsFromConnectionArgs(connectionArgs) {
  const { after, first = 10 } = connectionArgs;
  const afterOffset = getOffsetWithDefault(after, -1);

  const startOffset = Math.max(afterOffset, -1) + 1;
  const endOffset = startOffset + first;
  return { startOffset, endOffset };
}

export function createResource(type, data) {
  const Resource = RESOURCES[type];
  const resource = new Resource(data);
  return resource.saveAll();
}

export function getResource(type, id) {
  const Resource = RESOURCES[type];
  return Resource.get(id);
}

export function getResources(type, startOffset, endOffset) {
  const Resource = RESOURCES[type];
  return Resource
  .orderBy(r.desc('date'))
  .slice(Math.max(startOffset, 0), endOffset)
  .run();
}

export function removeResource(type, id) {
}

export function updateResource(type, id, data) {
}

createResource('Draft', { content: 'bar' });
createResource('Draft', { content: 'foo' });
