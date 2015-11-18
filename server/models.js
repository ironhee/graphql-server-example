import thinky, { type, r } from './thinky';
import _ from 'lodash';

const models = {};

export function getModel(name) {
  return models[name];
}

export function createModel(name, fields, ...args) {
  const model = thinky.createModel(name, {
    createdAt: type.date().default(r.now()),
    id: type.string().min(2),
    ...fields,
  }, ...args);
  models[name] = model;
  model.defineStatic('exist', exist);
  return model;
}

async function exist(offset) {
  try {
    return !_.isNull(await this.nth(offset).default(null));
  } catch (e) {
    return false;
  }
}

export const Draft = createModel('Draft', {
  content: type.string(),
});

export const Revision = createModel('Revision', {
  draftId: type.string(),
  content: type.string(),
});

export const User = createModel('User', {
  name: type.string(),
});

Draft.hasOne(Revision, 'revision', 'id', 'draftId');
Revision.belongsTo(Draft, 'draft', 'draftId', 'id');
