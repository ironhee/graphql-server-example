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
} from '../lib/edge';
import { createEndpoint } from '../lib/endpoint';
import {
  revisionEndpoint,
  GraphQLType as revisionType,
} from './revision';


const NAME = 'Draft';

export const draftEndpoint = createEndpoint(NAME, {
  content: {
    type: new GraphQLNonNull(GraphQLString),
  },
  createdAt: {
    type: new GraphQLNonNull(GraphQLString),
  },
  revision: {
    type: revisionType,
  },
});

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = draftEndpoint;

export const GraphQLReviseMutation = mutationWithClientMutationId({
  name: NAME + 'Revise',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draft: {
      type: GraphQLType,
    },
  },
  mutateAndGetPayload: async ({ id: draftGlobalId, content }) => {
    const { id: draftId } = fromGlobalId(draftGlobalId);
    const draft = await draftEndpoint.get(draftId);

    if (draft.revision) {
      const revision = draft.revision;
      revision.merge({ content });
      await revision.save();
    } else {
      const revision = await revisionEndpoint.create({ content });
      draft.revision = revision;
      await draft.saveAll({ revision: true });
    }

    return {
      draft,
    };
  },
});

export const GraphQLCreateMutation = mutationWithClientMutationId({
  name: NAME + 'Create',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLEdgeType,
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

export const GraphQLRemoveMutation = mutationWithClientMutationId({
  name: NAME + 'Remove',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLEdgeType,
      resolve: () => null,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }) => {
    const {id} = fromGlobalId(globalId);
    await draftEndpoint.remove(id);
  },
});

export const GraphQLUpdateMutation = mutationWithClientMutationId({
  name: NAME + 'Update',
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
      type: GraphQLEdgeType,
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
