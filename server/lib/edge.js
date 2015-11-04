import {
  resourceIdToCursor,
} from './arrayConnection';

export function resourceToEdge(resource) {
  const resourceType = resource.getModel().getTableName();
  const resourceId = resource.id;
  return {
    cursor: resourceIdToCursor(resourceType, resourceId),
    node: resource,
  };
}
