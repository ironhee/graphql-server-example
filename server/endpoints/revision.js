import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Revision } from '../models';
import {
  endpoint as draftEndpoint,
} from './draft';


export const endpoint = createEndpoint(Revision, () => ({
  content: {
    type: GraphQLString,
  },
  createdAt: {
    type: GraphQLString,
  },
  draft: {
    type: draftEndpoint.GraphQLType,
  },
}));

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = endpoint;
