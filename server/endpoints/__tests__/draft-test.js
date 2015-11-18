import test from 'ava';
import register from 'babel-core/register';
register();
import _ from 'lodash';
import { promisify } from 'bluebird';
import Joi from 'joi';
import { graphql, GraphQLSchema } from 'graphql';
import Schema from '../../schema';
import { Draft } from '../../models';
import { r } from '../../thinky';

const validate = promisify(Joi.validate);

test.before(async t => {
  await Draft.delete().run();
  t.end();
});

test.beforeEach(async t => {
  await Draft.delete().run();
  t.end();
});

test.after(async t => {
  r.tableDrop('Draft');
  await r.getPool().drain();
  t.end();
});

test.serial(async t => {
  // const Schema = new GraphQLSchema({
  //   query: {
  //     fields: {
  //
  //     }
  //   }
  // });
  await Draft.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      pool {
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
    }
  `);

  const schema1 = Joi.object().keys({
    pool: Joi.object().keys({
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
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const after = _.get(result1.data, 'pool.drafts.pageInfo.endCursor');
  const result2 = await graphql(Schema, `
    query {
      pool {
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
    }
  `);

  const schema2 = Joi.object().keys({
    pool: Joi.object().keys({
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
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});

test.serial(async t => {
  await Draft.save([
    { content: 'foo' },
    { content: 'bar' },
  ]);

  /* first request */
  const result1 = await graphql(Schema, `
    query {
      pool {
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
    }
  `);

  const schema1 = Joi.object().keys({
    pool: Joi.object().keys({
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
    }).required(),
  }).required();

  await validate(result1.data, schema1);

  /* second request */
  const before = _.get(result1.data, 'pool.drafts.pageInfo.startCursor');
  const result2 = await graphql(Schema, `
    query {
      pool {
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
    }
  `);

  const schema2 = Joi.object().keys({
    pool: Joi.object().keys({
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
    }).required(),
  });

  await validate(result2.data, schema2);

  t.end();
});
