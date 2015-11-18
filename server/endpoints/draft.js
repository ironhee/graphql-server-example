import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Draft } from '../models';
import {
  endpoint as revisionEndpoint,
} from './revision';


export const endpoint = createEndpoint(Draft, () => ({
  content: {
    type: new GraphQLNonNull(GraphQLString),
  },
  createdAt: {
    type: new GraphQLNonNull(GraphQLString),
  },
  revision: {
    type: revisionEndpoint.GraphQLType,
  },
}));

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = endpoint;
