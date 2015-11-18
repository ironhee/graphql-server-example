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
  toGlobalId,
} from 'graphql-relay';
import { getModel } from '../models';
import { r } from '../thinky';
import {
  connectionArgsToOffsets,
  assertConnectionArgs,
} from './arrayConnection';
import {
  resourceToEdge,
} from './edge';


const endpoints = {};

export function createEndpoint(name, ...args) {
  const Model = getModel(name);
  const endpoint = new Endpoint(Model, ...args);
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
    return endpoint.GraphQLType;
  }
);

export class Endpoint {
  constructor(Model, fields) {
    this.Model = Model;
    const name = Model.getTableName();
    this.name = name;
    this.GraphQLType = new GraphQLObjectType({
      name,
      fields: {
        id: globalIdField(name),
        ...fields,
      },
      interfaces: [nodeInterface],
    });
    const { connectionType, edgeType } = connectionDefinitions({
      name: name, nodeType: this.GraphQLType });
    this.GraphQLConnectionType = connectionType;
    this.GraphQLEdgeType = edgeType;
    this.GraphQLConnectionField = {
      type: this.GraphQLConnectionType,
      args: connectionArgs,
      resolve: async (root, args) => {
        const { after, before, last } = args;
        let { first } = args;

        if (_.all([first, last], _.isUndefined)) { first = 10; }

        return await this.getConnection({ after, first, before, last });
      },
    };
  }

  toGlobalId(id) {
    return toGlobalId(this.name, id);
  }

  fromGlobalId(globalId) {
    const { id } = fromGlobalId(globalId);
    return id;
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

  async getConnection({ after, first, before, last }) {
    assertConnectionArgs({ first, last });
    const query = this.Model.orderBy(r.desc('createdAt'));

    const { afterOffset, beforeOffset, startOffset, endOffset } =
      await connectionArgsToOffsets(query, { after, before, first, last });
    const edgesLength = beforeOffset - afterOffset + 1;

    const resources = await query.slice(startOffset, endOffset + 1).getJoin().run();

    const edges = resources.map((resource) =>
      resourceToEdge(resource));

    const firstEdge = _.first(edges);
    const lastEdge = _.last(edges);

    return {
      edges,
      pageInfo: {
        startCursor: firstEdge ? firstEdge.cursor : null,
        endCursor: lastEdge ? lastEdge.cursor : null,
        hasPreviousPage: last !== undefined && startOffset > 0 ?
          edgesLength > last : false,
        hasNextPage: first !== undefined ?
          edgesLength > first : false,
      },
    };
  }
}
