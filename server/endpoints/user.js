import { Router } from 'express';
import jwt from 'jwt-simple';
import {
  GraphQLString,
} from 'graphql';
import { JWT_SECRET } from '../../config';
import { createEndpoint } from '../lib/endpoint';
import { User } from '../models';


export const endpoint = createEndpoint(User, {
  name: {
    type: GraphQLString,
  },
  createdAt: {
    type: GraphQLString,
  },
});

export const {
  GraphQLType,
  GraphQLConnectionType,
  GraphQLEdgeType,
  GraphQLConnectionField,
} = endpoint;

export async function auth(/* name, password */) {
  const users = await endpoint.Model.limit(1).run();

  return users.length ? users[0] : await endpoint.create({
    name: 'hello-world',
  });
}

export function createToken(payload) {
  return jwt.encode({
    ...payload,
  }, JWT_SECRET);
}

export const router = new Router();
router.post('/auth', async (req, res) => {
  const { name, password } = req.body;

  const user = await auth(name, password);
  if (!user) {
    // TODO: Implement this part
    throw new Error();
  }
  const token = createToken({
    userId: endpoint.toGlobalId(user.id),
  });
  res.json({ token });
});
