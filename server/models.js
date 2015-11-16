import thinky, { type, r } from './thinky';

export const Draft = thinky.createModel('Draft', {
  id: type.string().min(2),
  content: type.string(),
  createdAt: type.date().default(r.now()),
});

export const Revision = thinky.createModel('Revision', {
  id: type.string().min(2),
  draftId: type.string(),
  content: type.string(),
  createdAt: type.date().default(r.now()),
});

export const User = thinky.createModel('User', {
  id: type.string().min(2),
  name: type.string(),
  createdAt: type.date().default(r.now()),
});


Draft.hasOne(Revision, 'revision', 'id', 'draftId');
Revision.belongsTo(Draft, 'draft', 'draftId', 'id');


export const models = {
  Draft,
  Revision,
  User,
};

export function getModel(modelName) {
  return models[modelName];
}
