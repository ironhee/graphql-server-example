import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';

const NAME = 'Revision';

export const revisionEndpoint = createEndpoint(NAME, {
  content: {
    type: GraphQLString,
  },
  createdAt: {
    type: GraphQLString,
  },
});

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = revisionEndpoint;
