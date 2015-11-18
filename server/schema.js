import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { nodeField } from './lib/endpoint';
import {
  GraphQLConnectionField as GraphQLDraftConnectionField,
} from './endpoints/draft';
import {
  GraphQLConnectionField as GraphQLRevisionConnectionField,
} from './endpoints/revision';
import {
  GraphQLConnectionField as GraphQLUserConnectionField,
} from './endpoints/user';
import {
  GraphQLReviseMutation as GraphQLDraftReviseMutation,
  GraphQLCreateMutation as GraphQLDraftCreateMutation,
  GraphQLUpdateMutation as GraphQLDraftUpdateMutation,
  GraphQLRemoveMutation as GraphQLDraftRemoveMutation,
} from './mutations/draft';

const GraphQLPool = new GraphQLObjectType({
  name: 'Pool',
  fields: {
    drafts: GraphQLDraftConnectionField,
    revision: GraphQLRevisionConnectionField,
    user: GraphQLUserConnectionField,
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    pool: {
      type: GraphQLPool,
      resolve: () => ({}),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    reviseDraft: GraphQLDraftReviseMutation,
    createDraft: GraphQLDraftCreateMutation,
    updateDraft: GraphQLDraftUpdateMutation,
    removeDraft: GraphQLDraftRemoveMutation,
  }),
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
