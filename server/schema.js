import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
} from 'graphql';

const count = 0;

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      count: {
        type: GraphQLInt,
        resolve(parentValue, _, { rootValue: { uid } }) {
          console.log(uid);
          return count;
        },
      },
    },
  }),
});

