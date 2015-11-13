import jwt from 'jwt-simple';


export default (secret) => {
  return (req, res, next) => {
    let token = {};
    try {
      token = req.get('Authorization').split('Bearer ')[1];
      token = jwt.decode(token, secret);
    } catch (e) {
      token = null;
    } finally {
      req.token = token;
      next();
    }
  };
};
