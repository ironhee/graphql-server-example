import _ from 'lodash';
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  globalIdField,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  applyCursorsToEdgeOffsets,
  edgeOffsetsToReturn,
} from './lib/arrayConnection';

import {
  resourceToEdge,
} from './lib/edge';

import { getModel } from './models';
import { r } from './thinky';

const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    const resource = await getModel(type).get(id).run();
    return resource || null;
  },
  (obj) => {
    if (obj.getModel) {
      switch (obj.getModel().getTableName()) {
      case 'Draft':
        return GraphQLDraft;
      default:
        return null;
      }
    }
    return null;
  }
);

const GraphQLDraft = new GraphQLObjectType({
  name: 'Draft',
  fields: {
    id: globalIdField('Draft'),
    content: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: DraftConnection,
  edgeType: GraphQLDraftEdge,
} = connectionDefinitions({
  name: 'Draft',
  nodeType: GraphQLDraft,
});

const GraphQLDraftCreateMutation = mutationWithClientMutationId({
  name: 'DraftCreate',
  inputFields: {
    content: {
      type: GraphQLString,
    },
  },
  outputFields: {
    draftEdge: {
      type: GraphQLDraftEdge,
      resolve: ({ resource }) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ content }) => {
    const Model = getModel('Draft');
    const resource = new Model({ content });
    await resource.saveAll();
    return { resource };
  },
});

const GraphQLDraftRemoveMutation = mutationWithClientMutationId({
  name: 'DraftRemove',
  inputFields: {
    id: {
      type: GraphQLString,
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
    const resource = await getModel('Draft').get(id).run();
    await resource.purge();
    return null;
  },
});

const GraphQLDraftUpdateMutation = mutationWithClientMutationId({
  name: 'DraftUpdate',
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
      type: GraphQLDraftEdge,
      resolve: (resource) => resourceToEdge(resource),
    },
  },
  mutateAndGetPayload: async ({ id: globalId, content }) => {
    const {id} = fromGlobalId(globalId);
    const resource = await getModel('Draft').get(id).run();
    _.assign(resource, { content });
    await resource.saveAll();
    return resource;
  },
});

const GraphQLPool = new GraphQLObjectType({
  name: 'Pool',
  fields: {
    drafts: {
      type: DraftConnection,
      args: connectionArgs,
      resolve: async (root, args) => {
        const { after, before, last } = args;
        let { first } = args;
        if (!first && !last) { first = 10; }

        const query = getModel('Draft').orderBy(r.desc('createdAt'));

        const { afterOffset, beforeOffset } =
          await applyCursorsToEdgeOffsets(query, { after, before });
        const { startOffset, endOffset } =
          await edgeOffsetsToReturn({ afterOffset, beforeOffset }, { first, last });

        if (endOffset === null) { throw Error('using last without before is not supported yet.'); }

        // endOffset + 1 is trick for check whether rows remain or not.
        const resources = await query.slice(startOffset, endOffset + 1).run();

        const edgesSize = endOffset - startOffset;
        const edges = resources.slice(0, edgesSize).map((resource) =>
          resourceToEdge(resource));

        const firstEdge = _.first(edges);
        const lastEdge = _.last(edges);
        const lowerBound = after ? (afterOffset + 1) : 0;
        const upperBound = before ? beforeOffset : startOffset + resources.length;
        return {
          edges,
          pageInfo: {
            startCursor: firstEdge ? firstEdge.cursor : null,
            endCursor: lastEdge ? lastEdge.cursor : null,
            hasPreviousPage: last !== null ? startOffset > lowerBound : false,
            hasNextPage: first !== null ? endOffset < upperBound : false,
          },
        };
      },
    },
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
    createDraft: GraphQLDraftCreateMutation,
    updateDraft: GraphQLDraftUpdateMutation,
    removeDraft: GraphQLDraftRemoveMutation,
  }),
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
