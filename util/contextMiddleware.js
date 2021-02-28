const { JWT_SECRET } = require('../config/env.json');
const jwt = require('jsonwebtoken');
module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split('Bearer ')[1];
    context.user = jwt.verify(token, JWT_SECRET);
  }

  return context;
};
