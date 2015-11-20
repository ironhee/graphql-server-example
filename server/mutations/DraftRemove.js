import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';
import draftEndpoint, {
  GraphQLEdgeType as GraphQLDraftEdge,
} from '../endpoints/draft';


export const DraftRemoveMutation = mutationWithClientMutationId({
  name: 'DraftRemove',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLDraftEdge,
      resolve: () => null,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }) => {
    const {id} = fromGlobalId(globalId);
    await draftEndpoint.remove(id);
  },
});
