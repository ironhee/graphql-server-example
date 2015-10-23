import low from 'lowdb';
import underscoreDB from 'underscore-db';


const db = low();
db._.mixin(underscoreDB);

export const createResource = (type, data) => {
  return db(type).insert({ ...data, type });
};

export const getResource = (type, id) => {
  return db(type).getById(id);
};

export const getAllResources = (type) => {
  return db(type).value();
};

export const removeResource = (type, id) => {
  return db(type).removeById(id);
};

export const updateResource = (type, id, data) => {
  return db(type).updateById(id, data);
};

createResource('Draft', { content: 'bar' });
createResource('Draft', { content: 'foo' });
