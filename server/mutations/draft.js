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
  GraphQLType as GraphQLDraft,
  GraphQLEdgeType as GraphQLDraftEdge,
} from '../endpoints/draft';
import revisionEndpoint from '../endpoints/revision';


export const GraphQLReviseMutation = mutationWithClientMutationId({
  name: 'DraftRevise',
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
      type: GraphQLDraft,
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

export const GraphQLRemoveMutation = mutationWithClientMutationId({
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

export const GraphQLUpdateMutation = mutationWithClientMutationId({
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
