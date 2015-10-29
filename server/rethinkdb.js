import _ from 'lodash';
import { r } from './thinky';
import models from './models';


export async function createResource(resourceType, data) {
  const Resource = models[resourceType];
  const resource = new Resource(data);
  await resource.saveAll();
  return resource;
}

export function getResource(resourceType, resourceId) {
  const Resource = models[resourceType];
  return Resource.get(resourceId);
}

export async function getResources(resourceType, startOffset, endOffset) {
  const Resource = models[resourceType];
  const resource = await Resource
    .orderBy(r.desc('date'))
    .slice(Math.max(startOffset, 0), endOffset)
    .run();
  return resource;
}

export async function removeResource(resourceType, resourceId) {
  const resource = await getResource(resourceType, resourceId);
  await resource.purge();
}

export async function updateResource(resourceType, resourceId, data) {
  const resource = await getResource(resourceType, resourceId);
  _.assign(resource, data);
  await resource.saveAll();
}

export async function addRelation(parentResourceType, parentResourceId,
                                  childResourceType, childResourceId, relationKey) {
  const parentResource = await getResource(parentResourceType, parentResourceId);
  const childResource = await getResource(childResourceType, childResourceId);
  const relation = parentResource[relationKey];
  parentResource[relationKey] = [...relation, childResource];
  await parentResource.saveAll();
}
