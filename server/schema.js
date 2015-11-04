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
  modelIdToCursor,
  applyCursorsToEdgeOffsets,
  edgeOffsetsToReturn,
} from './lib/arrayConnection';

import { getModel } from './models';
import { r } from './thinky';

const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    const model = await getModel(type).get(id).run();
    return model || null;
  },
  (obj) => {
    switch (obj.type) {
    case 'Draft':
      return draftType;
    default:
      return null;
    }
  }
);

const draftType = new GraphQLObjectType({
  name: 'Draft',
  fields: {
    id: globalIdField('Draft'),
    content: {
      type: GraphQLString,
    },
  },
  interfaces: [nodeInterface],
});

const {connectionType: draftConnection} =
  connectionDefinitions({name: 'Draft', nodeType: draftType});

const queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    node: nodeField,
    drafts: {
      type: draftConnection,
      args: connectionArgs,
      resolve: async (root, args) => {
        const { after, before, last } = args;
        let { first } = args;
        if (!first && !last) { first = 1; }

        const query = r.table('Draft').orderBy(r.desc('date'));

        const { afterOffset, beforeOffset } =
          await applyCursorsToEdgeOffsets(query, { after, before });
        const { startOffset, endOffset } =
          await edgeOffsetsToReturn({ afterOffset, beforeOffset }, { first, last });

        if (endOffset === null) { throw Error('using last without before is not supported yet.'); }

        // endOffset + 1 is trick for check whether rows remain or not.
        const resources = await query.slice(startOffset, endOffset + 1).run();

        const edgesSize = endOffset - startOffset;
        const edges = resources.slice(0, edgesSize).map((resource) => ({
          cursor: modelIdToCursor('Draft', resource.id),
          node: resource,
        }));
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

const draftMutationType = new GraphQLObjectType({
  name: 'DraftMutation',
  fields: () => ({
    create: mutationWithClientMutationId({
      name: 'DraftCreateMutation',
      inputFields: {
        content: {
          type: GraphQLString,
        },
      },
      outputFields: {
        node: {
          type: nodeInterface,
          resolve: (payload) => payload,
        },
      },
      mutateAndGetPayload: async ({ content }) => {
        const Model = getModel('Draft');
        const model = new Model({ content });
        await model.saveAll();
        return model;
      },
    }),
    remove: mutationWithClientMutationId({
      name: 'DraftRemoveMutation',
      inputFields: {
        id: {
          type: GraphQLString,
        },
      },
      outputFields: {
        node: {
          type: nodeInterface,
          resolve: (payload) => payload,
        },
      },
      mutateAndGetPayload: async ({ id: globalId }) => {
        const {id} = fromGlobalId(globalId);
        const resource = await r.table('Draft').get(id).run();
        await resource.purge();
        return null;
      },
    }),
    update: mutationWithClientMutationId({
      name: 'DraftUpdateMutation',
      inputFields: {
        id: {
          type: GraphQLString,
        },
        content: {
          type: GraphQLString,
        },
      },
      outputFields: {
        node: {
          type: nodeInterface,
          resolve: (payload) => payload,
        },
      },
      mutateAndGetPayload: async ({ id: globalId, content }) => {
        const {id} = fromGlobalId(globalId);
        const model = await r.table('Draft').get(id).run();
        _.assign(model, { content });
        await model.saveAll();
        return model;
      },
    }),
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    draft: {
      type: draftMutationType,
      resolve: (result) => result,
    },
  }),
});

// createResource('Draft', { content: 'bar' });
// createResource('Draft', { content: 'foo' });

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
