import {
  GraphQLString,
} from 'graphql';
import { createEndpoint } from '../lib/endpoint';
import { User } from '../models';


const endpoint = createEndpoint(User, {
  fields: {
    name: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
  },
});

export default endpoint;
