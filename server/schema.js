import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { nodeField } from './endpoints/endpoints';
import {
  graphQLConnectionField as graphQLDraftConnectionField,
  graphQLCreateMutation as graphQLDraftCreateMutation,
  graphQLUpdateMutation as graphQLDraftUpdateMutation,
  graphQLRemoveMutation as graphQLDraftRemoveMutation,
} from './endpoints/draftEndpoint';


const GraphQLPool = new GraphQLObjectType({
  name: 'Pool',
  fields: {
    drafts: graphQLDraftConnectionField,
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
    createDraft: graphQLDraftCreateMutation,
    updateDraft: graphQLDraftUpdateMutation,
    removeDraft: graphQLDraftRemoveMutation,
  }),
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
