import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Revision } from '../models';

export const endpoint = createEndpoint(Revision, {
  content: {
    type: GraphQLString,
  },
  createdAt: {
    type: GraphQLString,
  },
  // draft: {
  //   type: GraphQLDraft,
  // },
});

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = endpoint;
