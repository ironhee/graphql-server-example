import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  globalIdField,
  fromGlobalId,
} from 'graphql-relay';

import uuid from 'node-uuid';
import _ from 'lodash';

const drafts = [
  {
    id: uuid.v4(),
    content: 'abcd',
  },
  {
    id: uuid.v4(),
    content: 'foo',
  },
];

function getDraft(id) {
  return _.find(drafts, { id });
}

function getDrafts() {
  return drafts;
}

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    switch (type) {
    case 'Draft':
      return getDraft(id);
    default:
      return null;
    }
  },
  (/* obj */) => {
    return draftType;
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
      resolve: (root, args) => connectionFromArray(
        getDrafts(),
        args
      ),
    },
  },
});

export default new GraphQLSchema({
  query: queryType,
});

