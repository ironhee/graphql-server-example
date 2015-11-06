import {
  GraphQLString,
} from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';
import {
  resourceToEdge,
} from '../lib/edge';
import { createEndpoint } from './endpoints';


const NAME = 'Draft';

export const draftEndpoint = createEndpoint(NAME, {
  content: {
    type: GraphQLString,
  },
  createdAt: {
    type: GraphQLString,
  },
});

export const {
  graphQLType,
  graphQLConnectionType,
  graphQLEdgeType,
  graphQLConnectionField,
} = draftEndpoint;

export const graphQLCreateMutation = mutationWithClientMutationId({
  name: NAME + 'Create',
  inputFields: {
    content: {
      type: GraphQLString,
    },
  },
  outputFields: {
    draftEdge: {
      type: graphQLEdgeType,
      resolve: ({ resource }) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ content }) => ({
    resource: draftEndpoint.create({content}),
  }),
});

export const graphQLRemoveMutation = mutationWithClientMutationId({
  name: NAME + 'Remove',
  inputFields: {
    id: {
      type: GraphQLString,
    },
  },
  outputFields: {
    draftEdge: {
      type: graphQLEdgeType,
      resolve: () => null,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }) => {
    const {id} = fromGlobalId(globalId);
    await draftEndpoint.remove(id);
  },
});

export const graphQLUpdateMutation = mutationWithClientMutationId({
  name: NAME + 'Update',
  inputFields: {
    id: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
  outputFields: {
    draftEdge: {
      type: graphQLEdgeType,
      resolve: (resource) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ id: globalId, content }) => {
    const {id} = fromGlobalId(globalId);
    const resource = await draftEndpoint.update(id, { content });
    return { resource };
  },
});
