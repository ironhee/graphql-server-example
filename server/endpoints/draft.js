import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Draft } from '../models';
import revisionEndpoint from './revision';


const endpoint = createEndpoint(Draft, () => ({
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

export default endpoint;
