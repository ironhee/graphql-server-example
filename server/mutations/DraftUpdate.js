import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';
import {
  resourceToEdge,
} from '../lib/arrayConnection';
import draftEndpoint, {
  GraphQLEdgeType as GraphQLDraftEdge,
} from '../endpoints/draft';


export const DraftUpdateMutation = mutationWithClientMutationId({
  name: 'DraftUpdate',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: GraphQLString,
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLDraftEdge,
      resolve: (resource) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ id: globalId, content }) => {
    const {id} = fromGlobalId(globalId);
    const resource = await draftEndpoint.get(id);
    await resource.merge({ content }).save();
    return { resource };
  },
});
