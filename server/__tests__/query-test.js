import test from 'ava';
import register from 'babel-core/register';
register();
import { expect } from 'chai';
import { graphql } from 'graphql';
import Schema from '../schema';
import { Draft } from '../models';
import { r } from '../thinky';

test.before(t => {
  r.tableDrop('Draft');
  t.end();
});

test.after(t => {
  r.getPool().drain();
  t.end();
});

test(async t => {
  /*
    Request
    ========
    query {
      pool {
        drafts(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }

    Response
    ========
    {
      pool: {
        drafts: {
          edges: [{
            node: {
              id: "*****"
            }
          }]
        }
      }
    }
  */
  new Draft({ content: 'foobar' }).save();

  const result = await graphql(Schema, `
    query {
      pool {
        drafts(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `);

  expect(result.data)
    .to.have.deep.property('pool.drafts.edges').that.is.an('array')
    .with.have.length(1).with.deep.property('[0]').that.is.an('object')
    .with.have.deep.property('node').that.is.an('object')
    .with.have.property('id').that.is.an('string');

  t.end();
});
