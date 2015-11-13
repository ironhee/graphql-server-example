import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from './endpoints';

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
