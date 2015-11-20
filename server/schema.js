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
import DraftReviseMutation from './mutations/DraftRevise';
import DraftCreateMutation from './mutations/DraftCreate';
import DraftUpdateMutation from './mutations/DraftUpdate';
import DraftRemoveMutation from './mutations/DraftRemove';


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
    reviseDraft: DraftReviseMutation,
    createDraft: DraftCreateMutation,
    updateDraft: DraftUpdateMutation,
    removeDraft: DraftRemoveMutation,
  }),
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});


export default Schema;
