import thinky, { type, r } from './thinky';

const Draft = thinky.createModel('Draft', {
  id: type.string().min(2),
  content: type.string(),
  createdAt: type.date().default(r.now()),
});

const Revision = thinky.createModel('Revision', {
  id: type.string().min(2),
  draftId: type.string(),
  createdAt: type.date().default(r.now()),
});

const User = thinky.createModel('User', {
  id: type.string().min(2),
});


Draft.hasMany(Revision, 'revisions', 'id', 'draftId');
Revision.belongsTo(Draft, 'draft', 'draftId', 'id');


export const models = {
  Draft,
  Revision,
  User,
};

export function getModel(modelName) {
  return models[modelName];
}
