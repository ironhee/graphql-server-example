import test from 'ava';
import register from 'babel-core/register';
register();
import _ from 'lodash';
import { promisify } from 'bluebird';
import Joi from 'joi';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import {
  Model,
  GraphQLConnectionField,
} from '../draft';
import { r } from '../../thinky';


const validate = promisify(Joi.validate);
const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      drafts: GraphQLConnectionField,
    },
  }),
});

test.before(async t => {
  await Model.delete().run();
  t.end();
});

test.beforeEach(async t => {
  await Model.delete().run();
  t.end();
});

test.after(async t => {
  await r.getPool().drain();
  t.end();
});

test.serial(async t => {
  await Model.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      drafts(first: 1) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const schema1 = Joi.object().keys({
    drafts: Joi.object().keys({
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
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const after = _.get(result1.data, 'drafts.pageInfo.endCursor');
  const result2 = await graphql(Schema, `
    query {
      drafts(first: 1, after: "${after}") {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const schema2 = Joi.object().keys({
    drafts: Joi.object().keys({
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
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});

test.serial(async t => {
  await Model.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      drafts(last: 1) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const schema1 = Joi.object().keys({
    drafts: Joi.object().keys({
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
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const before = _.get(result1.data, 'drafts.pageInfo.startCursor');
  const result2 = await graphql(Schema, `
    query {
      drafts(last: 1, before: "${before}") {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const schema2 = Joi.object().keys({
    drafts: Joi.object().keys({
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
          }).required(),
        }).required(),
      ).required(),
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});
