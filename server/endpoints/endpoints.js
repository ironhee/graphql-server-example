import _ from 'lodash';
import {
  GraphQLObjectType,
} from 'graphql';
import {
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  globalIdField,
  fromGlobalId,
} from 'graphql-relay';
import { getModel } from '../models';
import { r } from '../thinky';
import {
  applyCursorsToEdgeOffsets,
  edgeOffsetsToReturn,
} from '../lib/arrayConnection';
import {
  resourceToEdge,
} from '../lib/edge';


const endpoints = {};

export function createEndpoint(name, ...args) {
  const endpoint = new Endpoint(name, ...args);
  endpoints[name] = endpoint;
  return endpoint;
}

export function getEndpoint(name) {
  return endpoints[name];
}

export const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    const { type: name, id } = fromGlobalId(globalId);
    const endpoint = getEndpoint(name);
    const resource = await endpoint.get(id).getJoin().run();
    return resource || null;
  },
  (obj) => {
    if (!obj.getModel) {
      return null;
    }
    const name = obj.getModel().getTableName();
    const endpoint = getEndpoint(name);
    return endpoint.graphQLType;
  }
);

export class Endpoint {
  constructor(name, fields) {
    this.name = name;
    this.Model = getModel(this.name);
    this.graphQLType = createGraphQLType(name, fields);
    const { graphQLConnectionType, graphQLEdgeType } = createConnectionDefinitions(name, this.graphQLType);
    this.graphQLConnectionType = graphQLConnectionType;
    this.graphQLEdgeType = graphQLEdgeType;
    this.graphQLConnectionField = createConnectionField(this);
  }

  async get(id) {
    return await this.Model.get(id).getJoin().run();
  }

  async create(attributes) {
    const resource = new this.Model(attributes);
    await resource.save();
    return resource;
  }

  async remove(id) {
    const resource = await this.Model.get(id).run();
    await resource.purge();
  }

  async getConnection(args) {
    const { after, before, last } = args;
    let { first } = args;
    if (!first && !last) { first = 10; }

    const query = this.Model.orderBy(r.desc('createdAt'));

    const { afterOffset, beforeOffset } =
      await applyCursorsToEdgeOffsets(query, { after, before });
    const { startOffset, endOffset } =
      await edgeOffsetsToReturn({ afterOffset, beforeOffset }, { first, last });

    if (endOffset === null) { throw Error('using last without before is not supported yet.'); }

    // endOffset + 1 is trick for check whether rows remain or not.
    const resources = await query.slice(startOffset, endOffset + 1).getJoin().run();

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
  }
}

function createGraphQLType(name, fields) {
  return new GraphQLObjectType({
    name,
    fields: {
      id: globalIdField(name),
      ...fields,
    },
    interfaces: [nodeInterface],
  });
}

function createConnectionDefinitions(name, graphQLType) {
  const {
    connectionType: graphQLConnectionType,
    edgeType: graphQLEdgeType,
  } = connectionDefinitions({
    name: name,
    nodeType: graphQLType,
  });
  return { graphQLConnectionType, graphQLEdgeType };
}

function createConnectionField(endpoint) {
  return {
    type: endpoint.graphQLConnectionType,
    args: connectionArgs,
    resolve: async (root, { after, first, before, last }) =>
      await endpoint.getConnection({ after, first, before, last }),
  };
}
