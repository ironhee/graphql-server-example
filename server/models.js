import thinky, { type, r } from './thinky';
import _ from 'lodash';

const models = {};

export function getModel(name) {
  return models[name];
}

export function createModel(name, ...args) {
  const model = thinky.createModel(name, ...args);
  models[name] = model;
  model.defineStatic('exist', exist);
  return model;
}

export const Draft = createModel('Draft', {
  id: type.string().min(2),
  content: type.string(),
  createdAt: type.date().default(r.now()),
});

export const Revision = createModel('Revision', {
  id: type.string().min(2),
  draftId: type.string(),
  content: type.string(),
  createdAt: type.date().default(r.now()),
});

export const User = createModel('User', {
  id: type.string().min(2),
  name: type.string(),
  createdAt: type.date().default(r.now()),
});

Draft.hasOne(Revision, 'revision', 'id', 'draftId');
Revision.belongsTo(Draft, 'draft', 'draftId', 'id');

async function exist(offset) {
  try {
    return !_.isNull(await this.nth(offset).default(null));
  } catch (e) {
    return false;
  }
}
