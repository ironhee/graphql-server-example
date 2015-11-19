import test from 'ava';
import register from 'babel-core/register';
register();
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import _ from 'lodash';
import { promisify } from 'bluebird';
import Joi from 'joi';
import {
  Endpoint,
} from '../endpoint';
import { createModel } from '../../models';
import { r, type } from '../../thinky';

const TABLE = 'endpointGraphQLTest';
let Model;
let endpoint;
let Schema;
const validate = promisify(Joi.validate);

test.before(async t => {
  Model = createModel(TABLE, {
    content: type.string(),
  });
  endpoint = new Endpoint(Model, {
    content: {
      type: GraphQLString,
    },
  });
  Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        models: endpoint.GraphQLConnectionField,
      },
    }),
  });
  await Model.delete().run();
  t.end();
});

test.beforeEach(async t => {
  await Model.delete().run();
  t.end();
});

test.after(async t => {
  r.tableDrop(TABLE);
  await r.getPool().drain();
  t.end();
});

test.serial('Endpoint#GraphQLConnectionField with first & after', async t => {
  await Model.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      models(first: 1) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            ...on ${TABLE} {
              content
            }
          }
        }
      }
    }
  `);

  const schema1 = Joi.object().keys({
    models: Joi.object().keys({
      pageInfo: Joi.object().keys({
        startCursor: Joi.string().required(),
        endCursor: Joi.string().required(),
        hasPreviousPage: Joi.valid(false).required(),
        hasNextPage: Joi.valid(true).required(),
      }).required(),
      edges: Joi.array().items(
        Joi.object().keys({
          node: Joi.object().keys({
            id: Joi.string().required(),
            content: Joi.string().required(),
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const after = _.get(result1.data, 'models.pageInfo.endCursor');
  const result2 = await graphql(Schema, `
    query {
      models(first: 1, after: "${after}") {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            ...on ${TABLE} {
              content
            }
          }
        }
      }
    }
  `);

  const schema2 = Joi.object().keys({
    models: Joi.object().keys({
      pageInfo: Joi.object().keys({
        startCursor: Joi.string().required(),
        endCursor: Joi.string().required(),
        hasPreviousPage: Joi.valid(false).required(),
        hasNextPage: Joi.valid(false).required(),
      }).required(),
      edges: Joi.array().items(
        Joi.object().keys({
          node: Joi.object().keys({
            id: Joi.string().required(),
            content: Joi.string().required(),
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});

test.serial('Endpoint#GraphQLConnectionField with last & before', async t => {
  await Model.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      models(last: 1) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            ...on ${TABLE} {
              content
            }
          }
        }
      }
    }
  `);

  const schema1 = Joi.object().keys({
    models: Joi.object().keys({
      pageInfo: Joi.object().keys({
        startCursor: Joi.string().required(),
        endCursor: Joi.string().required(),
        hasPreviousPage: Joi.valid(true).required(),
        hasNextPage: Joi.valid(false).required(),
      }).required(),
      edges: Joi.array().items(
        Joi.object().keys({
          node: Joi.object().keys({
            id: Joi.string().required(),
            content: Joi.string().required(),
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const before = _.get(result1.data, 'models.pageInfo.startCursor');
  const result2 = await graphql(Schema, `
    query {
      models(last: 1, before: "${before}") {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            ...on ${TABLE} {
              content
            }
          }
        }
      }
    }
  `);

  const schema2 = Joi.object().keys({
    models: Joi.object().keys({
      pageInfo: Joi.object().keys({
        startCursor: Joi.string().required(),
        endCursor: Joi.string().required(),
        hasPreviousPage: Joi.valid(false).required(),
        hasNextPage: Joi.valid(false).required(),
      }).required(),
      edges: Joi.array().items(
        Joi.object().keys({
          node: Joi.object().keys({
            id: Joi.string().required(),
            content: Joi.string().required(),
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});
