import { r } from './thinky';
import models from './models';
import {
  getOffsetWithDefault,
} from 'graphql-relay';


export function getOffsetsFromConnectionArgs(connectionArgs) {
  const { after, first = 10 } = connectionArgs;
  const afterOffset = getOffsetWithDefault(after, -1);

  const startOffset = Math.max(afterOffset, -1) + 1;
  const endOffset = startOffset + first;
  return { startOffset, endOffset };
}

export function createResource(modelType, data) {
  const Resource = models[modelType];
  const resource = new Resource(data);
  return resource.saveAll();
}

export function getResource(modelType, id) {
  const Resource = models[modelType];
  return Resource.get(id);
}

export function getResources(modelType, startOffset, endOffset) {
  const Resource = models[modelType];
  return Resource
  .orderBy(r.desc('date'))
  .slice(Math.max(startOffset, 0), endOffset)
  .run();
}

export function removeResource(modelType, id) {
}

export function updateResource(modelType, id, data) {
}

export function addRelation(parent, relationKey, child) {
  const relation = parent[relationKey];
  parent[relationKey] = [...relation, child];
}

createResource('Draft', { content: 'bar' });
createResource('Draft', { content: 'foo' });
