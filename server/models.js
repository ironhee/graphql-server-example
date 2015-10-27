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

export default {
  Draft,
  Revision,
};

Draft.hasMany(Revision, 'revisions', 'id', 'draftId');
Revision.belongsTo(Draft, 'draft', 'draftId', 'id');
