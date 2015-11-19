import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { Revision } from '../models';
import draftEndpoint from './draft';


const endpoint = createEndpoint(Revision, {
  fields: () => ({
    content: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
    draft: {
      type: draftEndpoint.GraphQLType,
    },
  }),
});

export default endpoint;
