import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Draft } from '../models';
import revisionEndpoint from './revision';


const endpoint = createEndpoint(Draft, {
  fields: () => ({
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    revision: {
      type: revisionEndpoint.GraphQLType,
    },
  }),
}, {
  resolveNode: async ({ node }, args, { rootValue: { currentUser } }) => {
    if (!currentUser) {
      return null;
    }
    return node;
  },
});

export default endpoint;
