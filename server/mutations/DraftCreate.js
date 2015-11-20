import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
} from 'graphql-relay';
import {
  resourceToEdge,
} from '../lib/arrayConnection';
import draftEndpoint, {
  GraphQLEdgeType as GraphQLDraftEdge,
} from '../endpoints/draft';

export const DraftCreateMutation = mutationWithClientMutationId({
  name: 'DraftCreate',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLDraftEdge,
      resolve: ({ resource }) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ content }) => {
    const draft = await draftEndpoint.create({content});
    return {
      resource: draft,
    };
  },
});
