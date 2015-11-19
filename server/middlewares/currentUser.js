import _ from 'lodash';
import userEndpoint from '../endpoints/user';


export default async (req, res, next) => {
  const userId = req.token ? req.token.userId : null;
  if (_.isNull(userId)) {
    req.currentUser = null;
    return next();
  }

  try {
    req.currentUser = await userEndpoint.get(
      userEndpoint.fromGlobalId(userId)
    );
  } catch (e) {
    req.currentUser = null;
  } finally {
    next();
  }
};
