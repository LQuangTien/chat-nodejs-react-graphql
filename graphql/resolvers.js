const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { JWT_SECRET } = require('../config/env.json');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        if (!context.req && !context.req.headers.authorization) {
          throw new AuthenticationError('Unanthenticated');
        }
        const token = context.req.headers.authorization.split('Bearer ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const users = await User.findAll({
          where: { username: { [Op.ne]: decodedToken.username } }
        });
        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      const errors = {};
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = 'User not found';
          throw new UserInputError('User not found', { errors });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
          errors.password = 'Password is incorrect';
          throw new AuthenticationError('Password is incorrect', { errors });
        }
        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60
        });
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Mutation: {
    register: async (_, args) => {
      const { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        if (username.trim() === '')
          errors.username = 'Username not must be empty';
        if (email.trim() === '') errors.email = 'Email not must be empty';
        if (password.trim() === '')
          errors.password = 'Password not must be empty';
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'Confirm password not must be empty';
        if (confirmPassword !== password)
          errors.confirmPassword = 'Password not match';
        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          email,
          password: hashPassword
        });
        return user;
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) =>
              (errors[e.path.split('.')[1]] = `${
                e.path.split('.')[1]
              } is already taken`)
          );
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError('Bad input', { errors });
      }
    }
  }
};
