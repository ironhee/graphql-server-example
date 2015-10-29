import { expect } from 'chai';
import _ from 'lodash';
import thinky, { type } from '../thinky';
import {
  getResource,
  getResources,
  createResource,
  removeResource,
  updateResource,
  getOffsetsFromConnectionArgs,
} from '../rethinkdb';
import models from '../models';

const Foo = thinky.createModel('Foo', {
  id: type.string(),
  content: type.string(),
});

const Bar = thinky.createModel('Bar', {
  id: type.string(),
  fooId: type.string(),
});

Foo.hasMany(Bar, 'bars', 'id', 'fooId');
Bar.belongsTo(Foo, 'foo', 'fooId', 'id');

async function clearAll() {
  await Foo.delete().run();
  await Bar.delete().run();
}

describe('rethinkdb', () => {
  let originalModel;

  before(() => {
    clearAll();
    originalModel = _.clone(models, true);
    _.assign(models, { Foo, Bar });
  });

  afterEach(() => {
    clearAll();
  });

  describe('#createResource', () => {
    it('should create resource in rethinkdb', async () => {
      const foo = await createResource('Foo', { content: 'hello world' });
      expect(foo).to.be.ok;
      expect(foo).to.have.property('id');
      expect(await Foo.run()).to.have.length.above(0);
    });
  });

  describe('#getResource', () => {
    it('should fetch resource in rethinkdb', async () => {
      const { id: fooId } = await createResource('Foo', { content: 'hello world' });
      const foo = await getResource('Foo', fooId);
      expect(_.pick(foo, 'id', 'content')).to.be.deep.equal({
        content: 'hello world',
        id: fooId,
      });
    });
  });

  describe('#updateResource', () => {
    it('should update resource in rethinkdb', async () => {
      const { id: fooId } = await createResource('Foo', { content: 'hello world' });
      await updateResource('Foo', fooId, { content: 'lorem ipsum' });
      const foo = await getResource('Foo', fooId);
      expect(foo).to.have.property('content', 'lorem ipsum');
    });
  });

  describe('#removeResource', () => {
    it('should fetch resource in rethinkdb', async () => {
      const { id: fooId } = await createResource('Foo', { content: 'hello world' });
      expect(await Foo.run()).to.have.length.above(0);
      await removeResource('Foo', fooId);
      expect(await Foo.run()).to.be.empty;
    });
  });

  describe('#addRelation', () => {
    it('should fetch resource in rethinkdb', async () => {
      const { id: fooId } = await createResource('Foo', { content: 'hello world' });
      expect(await Foo.run()).to.have.length.above(0);
      await removeResource('Foo', fooId);
      expect(await Foo.run()).to.be.empty;
    });
  });

  after(async () => {
    _.assign(models, originalModel);
    // https://github.com/neumino/thinky/issues/323
    await thinky.r.getPoolMaster().drain();
  });
});
